import { useEffect } from 'react';
import Game from './game.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
    useEffect(() => {
        Game();
    }, []);
  return (
    
    <div>
      <header>
        <div class="container menu">
            <div class="row">
                <div class="col col1">
                    <div class="divlogo">
                        <button id="btn_headImg" onclick="dropdown('hov'); image()">
                            <img id="headImg" class="logo logo2" src="image/gtPictures/KnightOpen.png"
                                alt="Guardian Tales Knight"/>
                        </button>
                    </div>
                    <div id="hov">
                        <div class="container">
                            <div class="row">
                                <div class="col">
                                    <a href="accountinfo.php">
                                        <h3>Profile</h3>
                                    </a>
                                </div>
                                <div class="col">
                                    <a href="/gacha.php">
                                        <h3>Gacha</h3>
                                    </a>
                                </div>
                                <div class="col">
                                    <a href="/game.php">
                                        <h3>Game</h3>
                                    </a>
                                </div>
                                <div class="col">
                                    <a href="/tierlist.php">
                                        <h3>Tierlist</h3>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col col2">
                    <img class="headerImg" src="image/gtPictures/MainIcon.png" alt="head"/>
                </div>
                <div class="col col3">
                <div className="div3">
        <div className="dropdown" style={{ paddingBottom: '1vh' }}>
          <a href="">
            <img id="headImg" className="logo" style={{width: "60px", height: "60px"}} alt="co" />
          </a>
        </div>
      </div>
                </div>
            </div>
        </div>
    </header>
      <h1 id="title">CV Dungeon</h1>
      <h2 id="subtitle">A CVGame by <a href="https://github.com/Polonit" target="_blank">Louis de Lavenne de Choulot de Chabaud-la-Tour</a></h2>
      <p>Use [z]/[w], [q]/[a], [s], [d] to move, qzsd is also wasd or arrows</p>
      <p>[enter] key to open the UI, once in the UI :<br/>[z]/[w] to move up, [s] to move down, [d] or [enter] to select</p>
      <i>(interact with projects via the yellow squares then press 'e')</i>
      <br/>
      <label htmlFor="animated">Animated mode (move to see it in action)</label>
      <input type="checkbox" id="animated" name="animated" value="animated" />
      <br/>
      <span>
        <label htmlFor="stylish">Stylish slow mode (move to see it in action)</label>
        <input type="checkbox" id="stylish" name="stylish" value="stylish" />
        {/* slider to change the speed of the refresh */}
        <input type="range" min="1" max="100" defaultValue="50" className="slider" id="myRange" />
      </span>
      <div id="image_map">
        <canvas id="canvass" style={{ height: '564px', width: '564px', imageRendering: 'pixelated' }}></canvas>
        {/* create overlapping canvas with id "Characters" to display the UI */}
        <canvas id="characters" style={{ height: '564px', width: '564px', imageRendering: 'pixelated' }}></canvas>
        {/* create overlapping canvas with id "UI" to display the UI */}
        <canvas id="ui" style={{ height: '564px', width: '564px', imageRendering: 'pixelated' }}></canvas>
      </div>
      <p id="xp"></p>
    </div>
  );
}

export default HomePage;