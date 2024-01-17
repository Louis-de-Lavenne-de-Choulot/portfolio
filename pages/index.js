import { useEffect } from 'react';
import Game from './game.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
    useEffect(() => {
        Game();
    }, []);
  return (
    <div style={{fontFamily: "monospace", backgroundColor: "black", color: "white", height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflowX: "hidden"}}>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
      <h1 id="title">Welcome on my CV</h1>
      <h3 id="subtitle">by: <a href="https://github.com/Polonit" target="_blank">Louis de Lavenne de Choulot de Chabaud-la-Tour</a></h3>
      </div>
      <span style={{marginTop: "4vw", display: "flex", justifyContent: "space-evenly", fontSize: "20px"}}>
      <div>
      <p>Use [z]/[w], [q]/[a], [s], [d] to move (ZQSD or WASD or Arrows)</p>
      <p>[enter] key to open the UI :<br/>[z]/[w] to move up<br/> [s] to move down<br/> [d] or [enter] to select</p>
      <i>(interact with projects via the yellow squares then press 'e')</i>
      <br/>
      <input type="checkbox" id="animated" name="animated" value="animated" />
      <label htmlFor="animated"> Activate Animated mode (move to see it in action)</label>
      <br/>
      <span>
      <input type="checkbox" id="stylish" name="stylish" value="stylish" />
        <label htmlFor="stylish"> Activate Behind the scene slow mode (move to see it in action)</label>
        {/* slider to change the speed of the refresh */}
        <input type="range" min="1" max="100" defaultValue="50" className="slider" id="myRange" />
      </span>
      </div>
      <div id="image_map">
        <canvas id="canvass" style={{ height: '564px', width: '564px', imageRendering: 'pixelated' }}></canvas>
        {/* create overlapping canvas with id "Characters" to display the UI */}
        <canvas id="characters" style={{ height: '564px', width: '564px', imageRendering: 'pixelated' }}></canvas>
        {/* create overlapping canvas with id "UI" to display the UI */}
        <canvas id="ui" style={{ height: '564px', width: '564px', imageRendering: 'pixelated' }}></canvas>
      </div>
      </span>
      {/* affichage du cv traditionnnel en format public\Louis de Lavenne de Choulot.pdf*/}
      <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", marginTop: "20vw", backgroundColor: "black"}}>
      <h3 id="subtitle">Download my CV</h3>
      <a href="\cv.pdf" download="Louis de Lavenne de Choulot.pdf">Download</a>
      {/* previex */}
      <iframe src="\cv.pdf" width="900px" height="1200px">
      </iframe>
    </div>
    </div>
  );
}

export default HomePage;