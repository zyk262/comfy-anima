import { Composition } from "remotion";
import { PelicanRide } from "./Composition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="PelicanRide"
      component={PelicanRide}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        bicycleColor: "#4d9d8f",
        scarfColor: "#e78054",
        showTitle: true,
      }}
    />
  );
};
