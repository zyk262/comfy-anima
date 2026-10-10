import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { PelicanRide } from "../src/Composition";
import "./style.css";

const inputProps = {
  bicycleColor: "#4d9d8f",
  scarfColor: "#e78054",
  showTitle: true,
};

const App = () => (
  <main>
    <header>
      <p className="eyebrow">THE PELICAN PEDAL CLUB</p>
      <h1>鹈鹕骑自行车</h1>
      <p className="intro">海风、两个轮子，还有一段不赶时间的旅程。</p>
    </header>
    <section className="player" aria-label="鹈鹕骑自行车的 3D 动画播放器">
      <Player
        component={PelicanRide}
        inputProps={inputProps}
        durationInFrames={360}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        autoPlay
        loop
        initiallyMuted
        controls
        showVolumeControls={false}
        clickToPlay
        doubleClickToFullscreen
        style={{ width: "100%", aspectRatio: "16 / 9" }}
        renderLoading={() => <div className="status" role="status">正在准备海边骑行…</div>}
        errorFallback={() => <div className="status" role="alert">动画加载失败，请刷新页面或换一个浏览器再试。</div>}
      />
    </section>
    <footer>
      <span>自动循环播放 · 可暂停、拖动进度或全屏观看</span>
      <a href="https://github.com/zyk262/pelican-riding-a-bicycle" target="_blank" rel="noreferrer">GitHub ↗</a>
    </footer>
  </main>
);

const container = document.getElementById("root");
if (!container) throw new Error("Missing page root");
createRoot(container).render(<App />);
