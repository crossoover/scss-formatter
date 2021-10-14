/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { STRUCTURE } from "./structure";
import "./index.css";
import codeImage from "./assets/example.png";
import videoExample from "./assets/video.mp4";

const App = () => {
  const [startValue, setStartValue] = useState<string>("");
  const [parsedValue, setParsedValue] = useState<string>("");
  const [isInstructionShown, setIsInstructionShown] = useState<boolean>(false);
  const [isVideoShown, setIsVideoShown] = useState<boolean>(false);
  const enums = Object.keys(STRUCTURE).filter((x) => !(parseInt(x) >= 0));

  const relocateValues = (value: string) => {
    const res = value
      .split(/\r?\n/)
      .filter((i) => i.includes(";") && i.includes(":"));
    let arr: any = new Array(enums.length).fill(null);
    for (let i = 0; i < res.length; i++) {
      for (let j = 0; j < enums.length; j++) {
        if (res[i].includes(enums[j])) {
          console.log(`putting ${res[i]} to ${j} position (${enums[j]})`);
          arr.splice(j, 0, res[i]);
          break;
        }
      }
      if (!arr.includes(res[i])) {
        arr.splice(arr.length, 0, res[i]);
      }
    }
    console.log(arr);
    return arr.filter((i: string) => i).join("\n");
  };

  const divideIntoBlocks = (value: string) => {
    const res = value
      .split("\n\n")
      .map((item) => {
        const parsedItem = item.split(/\r?\n/);
        let top = "";
        let main = "";
        for (let i = 0; i < parsedItem.length; i++) {
          if (parsedItem[i].includes(";") && parsedItem[i].includes(":")) {
            main += "\n" + parsedItem[i];
          } else if (!parsedItem[i].includes("}")) {
            top += "\n" + parsedItem[i];
          }
        }
        main = relocateValues(main);
        return top + "\n" + main;
      })
      .join("\n")
      .replaceAll("{", "")
      .replaceAll(";", "")
      .slice(1);
    console.log(res);
    return res;
  };

  useEffect(() => {
    setParsedValue(divideIntoBlocks(startValue));
  }, [startValue]);

  return (
    <div className="app">
      <div className="instruction">
        <button onClick={() => setIsInstructionShown(!isInstructionShown)}>
          {isInstructionShown ? "Hide" : "Show"} instructions
        </button>
        <button onClick={() => setIsVideoShown(!isVideoShown)}>
          {isVideoShown ? "Hide" : "Show"} video
        </button>
        <div className={isInstructionShown ? "list shown" : "list hidden"}>
          <p>
            1. Make sure your SCSS code is properly formatted with spaces.
            <br />
            It needs to look like this:
          </p>
          <img src={codeImage} alt="" />
          <br />
          <br />
          <p>
            2. Enter your code and copy its SASS version.
            <br />
            (click button in the top-right corner)
          </p>
          <br />
          <p>
            3. Enter copied code to the second formatter on the bottom.
            <br />
            (make sure you choose SASS to SCSS formatter)
          </p>
          <br />
          <p>
            4. Boom, your SCSS is formatted the way it MUST be.
            <br />
            Just take a look at the properties order.
          </p>
        </div>
        <div className={isVideoShown ? "video shown" : "video hidden"}>
          <video controls src={videoExample} />
        </div>
      </div>
      <div className="areas">
        <textarea
          value={startValue}
          onChange={(e: any) => setStartValue(e.target.value)}
        />
        <button
          onClick={async () => {
            const text = document.querySelector("#text")?.textContent;
            if (text) await navigator.clipboard.writeText(text);
          }}
        >
          <img
            src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-file-2.png&r=255&g=255&b=255"
            alt=""
          />
        </button>
        <textarea
          id="text"
          disabled
          value={parsedValue}
          onChange={(e: any) => setParsedValue(e.target.value)}
        />
      </div>
      <iframe
        title="second-formatter"
        src="https://sass-scss-converter.netlify.app/"
      ></iframe>
    </div>
  );
};

export default App;
