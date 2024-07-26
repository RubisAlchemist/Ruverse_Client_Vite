import { CameraAlt, LocationOn, Mic } from "@mui/icons-material";
import { useMemo, useState } from "react";
const useDevicePermissions = () => {
  const [permissions, setPermissions] = useState([
    {
      key: "camera",
      icon: <CameraAlt />,
      name: "카메라",
      isPermitted: false,
      loading: false,
      error: false,
    },
    {
      key: "location",
      icon: <LocationOn />,
      name: "GPS",
      isPermitted: false,
      loading: false,
      error: false,
    },
    {
      key: "microphone",
      icon: <Mic />,
      name: "마이크",
      isPermitted: false,
      loading: false,
      error: false,
    },
  ]);

  // 모든 권한이 허용 됐는지 확인
  const isAllPermissionsGranted = useMemo(
    () => permissions.every((permission) => permission.isPermitted),
    [permissions]
  );

  /**
   * @param {string} key : 허용 할 권한의 이름
   */
  const handlePermissions = async (key) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.key === key ? { ...permission, loading: true } : permission
      )
    );
    switch (key) {
      case "camera":
        await handleCameraPermission();
        break;
      case "microphone":
        await handleMicrophonePermission();
        break;
      case "location":
        handleGpsPermission();
        break;

      default:
        break;
    }
  };

  /**
   * 카메라 권한
   */
  const handleCameraPermission = async () => {
    try {
      const permissionStatus = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (permissionStatus.active) {
        console.log("허용");
        setPermissions((prevPermissions) =>
          prevPermissions.map((permission) =>
            permission.key === "camera"
              ? { ...permission, isPermitted: true, loading: false }
              : permission
          )
        );
      }
    } catch (error) {
      alert("카메라 권한을 허용해 주세요");
      setPermissions((prevPermissions) =>
        prevPermissions.map((permission) =>
          permission.key === "camera"
            ? { ...permission, isPermitted: false, loading: false }
            : permission
        )
      );
    }
  };

  /**
   * 마이크 권한
   */
  const handleMicrophonePermission = async () => {
    try {
      const permissionStatus = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (permissionStatus.active) {
        setPermissions((prevPermissions) =>
          prevPermissions.map((permission) =>
            permission.key === "microphone"
              ? { ...permission, isPermitted: true, loading: false }
              : permission
          )
        );
      }
    } catch (error) {
      alert("마이크 권한을 허용해 주세요");
      setPermissions((prevPermissions) =>
        prevPermissions.map((permission) =>
          permission.key === "microphone"
            ? { ...permission, isPermitted: false, loading: false }
            : permission
        )
      );
    }
  };

  /**
   * GPS 권한
   * gps 권한의 경우 success, error 일 때 처리할 콜백 함수를 넘겨주어야 한다.
   */

  // 성공했을 경우
  const handleSuccess = () => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.key === "location"
          ? { ...permission, isPermitted: true, loading: false }
          : permission
      )
    );
  };

  // 실패했을 경우
  const handleError = (err) => {
    alert(`gps 권한을 허용해 주세요 ${err}`);
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.key === "location"
          ? { ...permission, isPermitted: false, loading: false }
          : permission
      )
    );
  };
  const handleGpsPermission = () => {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {});
  };

  return { permissions, handlePermissions, isAllPermissionsGranted };
};

export default useDevicePermissions;
