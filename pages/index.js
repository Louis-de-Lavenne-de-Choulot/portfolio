import { useEffect, useRef } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Game from './game.js';


function PhonePage() {
    useEffect(() => {
        Game();
    }, []);
  
  return (
    <div className={"phone"}>
      <div className={"gameboy-div"}>
      <div className={"gameboy"}>
        <div id="image_map">
        <canvas className={"canvas"} id="canvass" height="700" width="700"></canvas>
        <canvas className={"canvas"} id="items" height="700" width="700"></canvas>
        <canvas className={"canvas"} id="characters" height="700" width="700"></canvas>
        <canvas className={"canvas"} id="ui" height="700" width="700"></canvas>
        </div>
        <div className={"buttons"}>
          <button className={"button"}id='ebtn'>E</button>
        </div>
        <div className="directional-cross">
  <div className="cross-arm cross-arm-top" id='topcross'></div>
  <div className="cross-arm cross-arm-right" id='rightcross'></div>
  <div className="cross-arm cross-arm-bottom" id='bottomcross'></div>
  <div className="cross-arm cross-arm-left" id='leftcross'></div>
</div>
</div>
      </div>
    </div>
  );
}

export default PhonePage;