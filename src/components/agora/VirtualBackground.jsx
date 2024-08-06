import { Box } from "@mui/material";
import VirtualBackgroundExtension from "agora-extension-virtual-background";
import AgoraRTC, { useConnectionState } from "agora-rtc-react";
import { useEffect, useRef, useState } from "react";
import remoteBackgroundImage from "@assets/images/base-img.png";
import wasm from "../../wasms/agora-wasm.wasm?url";

import { Button, Typography } from "@mui/material";
import { useAgoraTrackContext } from "@hooks/agora-ruverse/useAgoraTrackContext";

const VirtualBackground = () => {
  const connectionState = useConnectionState();
  const [isVirtualBackground, setVirtualBackground] = useState(true);

  return (
    <>
      {isVirtualBackground ? (
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setVirtualBackground(false)}
            sx={{
              width: { xs: "80px", md: "100px", lg: "120px" },
              height: { xs: "30px", md: "40px", lg: "50px" },
            }}
          >
            <Typography fontSize={{ xs: "12px", md: "16px", lg: "18px" }}>
              가상화면 끄기
            </Typography>
          </Button>
          <AgoraExtensionComponent />
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: { xs: "80px", md: "100px", lg: "120px" },
            height: { xs: "30px", md: "40px", lg: "50px" },
          }}
          onClick={() => setVirtualBackground(true)}
          disabled={connectionState !== "CONNECTED"}
        >
          <Typography fontSize={{ xs: "12px", md: "16px", lg: "18px" }}>
            가상화면
          </Typography>
        </Button>
      )}
    </>
  );
};

function AgoraExtensionComponent() {
  const connectionState = useConnectionState();
  const agoraContext = useAgoraTrackContext();

  const extension = useRef(new VirtualBackgroundExtension());
  const processor = useRef();

  const [selectedOption, setSelectedOption] = useState("image");
  const [customImage, setCustomImage] = useState(null);

  const checkCompatibility = () => {
    if (!extension.current.checkCompatibility()) {
      console.error("Virtual background not supported on this platform.");
    }
  };

  const colorBackground = () => {
    processor.current?.setOptions({ type: "color", color: "#00ff00" });
  };

  const imageBackground = (imageFile) => {
    console.log("Setting image background with image:", imageFile);
    const img = new Image();
    img.onload = () => {
      console.log("Image loaded successfully");
      processor.current?.setOptions({ type: "img", source: img });
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
    img.src = remoteBackgroundImage;
  };

  const blurBackground = () => {
    processor.current?.setOptions({ type: "blur", blurDegree: 2 });
  };

  useEffect(() => {
    const initializeVirtualBackgroundProcessor = async () => {
      AgoraRTC.registerExtensions([extension.current]);

      checkCompatibility();

      if (agoraContext.localCameraTrack) {
        console.log("Initializing virtual background processor...");
        try {
          processor.current = extension.current.createProcessor();
          await processor.current.init(wasm);
          agoraContext.localCameraTrack
            .pipe(processor.current)
            .pipe(agoraContext.localCameraTrack.processorDestination);

          imageBackground();

          await processor.current.enable();
          setSelectedOption("image");
        } catch (error) {
          console.error("Error initializing virtual background:", error);
        }
      }
    };

    void initializeVirtualBackgroundProcessor();

    return () => {
      const disableVirtualBackground = async () => {
        processor.current?.unpipe();
        agoraContext.localCameraTrack?.unpipe();
        await processor.current?.disable();
      };
      void disableVirtualBackground();
    };
  }, [agoraContext.localCameraTrack]);

  const changeBackground = (selectedOption) => {
    console.log("Selected background option:", selectedOption);
    if (!processor.current) {
      console.error("Virtual background processor not initialized");
      return;
    }

    switch (selectedOption) {
      case "color":
        setSelectedOption(selectedOption);
        colorBackground();
        break;
      case "blur":
        setSelectedOption(selectedOption);
        blurBackground();
        break;
      case "image":
        setSelectedOption(selectedOption);
        imageBackground();
        break;
      default:
        console.error("Invalid option:", selectedOption);
    }
  };

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Image uploaded:", file);
      setCustomImage(file);
      if (selectedOption === "image") {
        imageBackground(file);
      }
    }
  };

  return (
    <div>
      <select
        defaultValue={"image"}
        value={selectedOption}
        onChange={(event) => {
          setSelectedOption(event.target.value);
          changeBackground(event.target.value);
        }}
        disabled={connectionState === "DISCONNECTED"}
      >
        <option value="color">Color</option>
        <option value="blur">Blur</option>
        <option value="image" selected>
          Image
        </option>
      </select>
    </div>
  );
}

export default VirtualBackground;
