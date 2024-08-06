import { agoraClient } from "@apis/agora";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ruverseClient } from "@apis/ruverse";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const REGION = import.meta.env.VITE_APP_REGION;
const ACCESS_KEY_ID = import.meta.env.VITE_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY_ID = import.meta.env.VITE_SECRET_ACCESS_KEY_ID;
const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY_ID,
  },
});

const requestAgoraRecord = createAsyncThunk(
  "asyncThunk/agoraRecordStart",
  async (channelInfo) => {
    const { cname, uid } = channelInfo;
    const acquireRequest = {
      cname: window.atob(cname),
      uid: window.atob(uid),
      clientRequest: {
        resourceExpiredHour: 24,
        scene: 1, // 1로 고정해야 합니다.
      },
    };

    /**
     * 1. call the acquire method
     * 아고라에 recording 요청을 보내기 전에 먼저 acquire 요청을 보내서
     * resource ID를 등록해야합니다.
     *    - recording stop 요청에 필요함
     *
     * @param {string} cname  - 녹화 요청한 유저가 들어간 채널 이름
     * @param {string} uid    - 녹화 요청한 유저의 uid
     * @return {string} resourceId
     */
    const acquireResponse = await agoraClient.post(
      "/cloud_recording/acquire",
      acquireRequest
    );

    const { resourceId } = acquireResponse.data;

    // Agora REST API 호출해 녹화 요청
    // 웹 페이지에서 cname, uid는 url 상에서 base64 인코딩 된 상태로 표현 되므로
    // serviceParam url에 똑같이 Base64 인코딩해서 넘겨줌
    const recordUid = `${window.atob(uid)}1029384756`;
    console.log(`[REQUEST RECORDING] cname: ${cname} uid: ${uid}`);

    const url = `${import.meta.env.VITE_CLIENT_URL}/${cname}/${window.btoa(
      recordUid
    )}/record?local=${uid}`;

    console.log(`[URL] ${url}`);

    /**
     * 2. request recording
     * 아고라에 recording 요청을 보냅니다.
     * 요청에 대한 response로 받은 sid를 메모리 캐시에 저장합니다.
     *  - sid: recording stop 요청에 필요
     * @param {string} cname  - 녹화 요청한 유저가 들어간 채널 이름
     * @param {string} uid    - 녹화 요청한 유저의 uid
     */
    const recordResponse = await agoraClient.post(
      `/cloud_recording/resourceid/${resourceId}/mode/web/start`,
      {
        cname: window.atob(cname), // 녹화할 채널 이름
        uid: window.atob(uid), // 녹화 요청한 유저 uid
        clientRequest: {
          // token,
          extensionServiceConfig: {
            errorHandlePolicy: "error_abort",
            extensionServices: [
              {
                serviceName: "web_recorder_service",
                errorHandlePolicy: "error_abort",
                serviceParam: {
                  url: url,
                  audioProfile: 0,
                  videoWidth: 1280,
                  videoHeight: 720,
                  maxRecordingHour: 1, // 녹화 최대 가능 시간
                },
              },
            ],
          },
          recordingFileConfig: {
            avFileType: ["hls", "mp4"],
          },
          storageConfig: {
            // https://docs.agora.io/en/cloud-recording/reference/region-vendor
            vendor: 1, // 1: Amazon S3
            region: 11, // 11: ap-northeast-2
            bucket: import.meta.env.VITE_BUCKET_NAME,
            accessKey: import.meta.env.VITE_ACCESS_KEY_ID,
            secretKey: import.meta.env.VITE_SECRET_ACCESS_KEY_ID,
            fileNamePrefix: [],
          },
        },
      }
    );

    console.log(`[REQUEST RECORDING SUCCESS]`);
    console.log(recordResponse.data);

    const { sid } = recordResponse.data;

    return { resourceId, sid };
  }
);

const requestAgoraRecordStop = createAsyncThunk(
  "asyncThunk/agoraRecordStop",
  async (channelInfo, thunkAPI) => {
    const state = thunkAPI.getState();

    const { cname, uid } = channelInfo;
    const { resourceId, sid } = state.agora;

    if (!resourceId || !sid) {
      throw new Error(
        `chaennel: ${cname} uid: ${uid}에 대한 resourceId 또는 sid가 존재하지 않습니다.`
      );
    }

    await agoraClient.post(
      `/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/web/stop`,
      {
        cname: window.atob(cname), // 녹화할 채널 이름
        uid: window.atob(uid), // 녹화 요청한 유저 uid
        clientRequest: {},
      }
    );
  }
);

const requestS3Upload = createAsyncThunk(
  "asyncThunk/s3RecordUpload",
  async (uploadData, thunkAPI) => {
    const state = thunkAPI.getState();

    // 채널 이름, uid
    const { cname: channelName, uid } = uploadData.channelInfo;

    // 로컬에서 녹화한 비디오 블롭
    const { videoRecordBlob } = uploadData;

    // 아고라 녹화파일 sid
    const { sid } = state.agora;

    // 로거 데이터
    const { gps, touch, accelGyro, stylus, eyetracking } = state.logger;

    const loggerData = {
      gpsData: gps,
      touchData: touch,
      accelGyroData: accelGyro,
      stylusData: stylus,
      eyetrackingData: eyetracking,
      uid,
      channelName,
    };

    // JSON 문자열로 변환
    const jsonString = JSON.stringify(loggerData);

    // Blob 객체 생성
    const loggerBlob = new Blob([jsonString], { type: "application/json" });

    const loggerDataSizeMB = loggerBlob.size / (1024 * 1024);
    console.log(`[HANDLE_UPLOAD] logger data size = ${loggerDataSizeMB}`);

    const loggerKey = `${channelName}_${uid}_logger_Data_${new Date().toISOString()}.json`;

    if (loggerDataSizeMB >= 200) {
      await uploadToS3LargeSize(loggerKey, loggerBlob);
    } else {
      await uploadToS3SmallSize(loggerKey, loggerBlob);
    }

    // 비디오 업로드
    const videoRecordSizeMB = videoRecordBlob.size / (1024 * 1024);

    const videoKey = `${channelName}_${uid}_비디오${new Date().toISOString()}.mp4`;

    let videoFile = new File([videoRecordBlob], videoKey, {
      type: "video/mp4",
      lastModified: Date.now(),
    });
    console.log(`[HANDLE_UPLOAD] video blob size = ${videoRecordSizeMB}`);
    console.log(videoFile);

    if (videoRecordSizeMB >= 200) {
      await uploadToS3LargeSize(videoKey, videoFile);
    } else {
      await uploadToS3SmallSize(videoKey, videoFile);
    }

    // 아고라 네이밍 컨벤션에 따른 스크린 녹화 키 설정
    // https://docs.agora.io/en/cloud-recording/develop/manage-files
    const screenKey = `${sid}_${channelName}_0.mp4`;
    console.log(screenKey);

    await uploadDB(channelName, uid, loggerKey, videoKey, screenKey);
  }
);

/**
 * S3 Upload
 * 대용량 파일 업로드
 * @param {*} key
 * @param {*} file
 */
const uploadToS3LargeSize = async (key, file) => {
  console.log("[CALL] uploadToS3");

  try {
    const upload = new Upload({
      client: s3Client,
      leavePartsOnError: false,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
      },
    });

    upload.on("httpUploadProgress", (process) => console.log(process));

    await upload.done();
  } catch (err) {
    console.log("upload failed");
    console.log(err);
  }
};

/**
 * S3 업로드
 * 적은 용량 업로드
 * @param {*} key
 * @param {*} file
 */
const uploadToS3SmallSize = async (key, file) => {
  console.log("[CALL] uploadToS3SmallSize");

  try {
    const response = await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Body: file,
        Key: key,
      })
    );

    console.log(`${key} uploaded successfully.`);
    console.log(response);
    // channelName & Uid & loggerDataKey & videoKey 서버 전달
    //   await uploadDB(channelName, uid, loggerDataKey, videoKey);
  } catch (err) {
    console.log(`${key} uploaded failed.`);
    console.log(err);
  }
};

/**
 * 서버에 데이터 전송
 * @param {*} channelName
 * @param {*} uid
 * @param {*} loggerDataKey
 * @param {*} videoKey
 * @param {*} screenKey
 */
const uploadDB = async (
  channelName,
  uid,
  loggerDataKey,
  videoKey,
  screenKey
) => {
  // 전송할 데이터 구성
  const request = {
    channelName,
    uid,
    loggerDataKey,
    videoKey,
    screenKey,
  };

  const response = await ruverseClient.post("/upload", request);

  console.log("Upload successful:", response.data);
};

export { requestAgoraRecord, requestAgoraRecordStop, requestS3Upload };
