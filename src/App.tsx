/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { STRUCTURE } from "./structure";
import "./index.css";

const App = () => {
  const [startValue, setStartValue] = useState<string>("");
  const [parsedValue, setParsedValue] = useState<string>("");
  const [isCopiedAlertShown, setIsCopiedAlertShown] = useState<boolean>(false);

  const relocateValues = (value: string) => {
    let enums = Object.keys(STRUCTURE).filter((x) => !(parseInt(x) >= 0));
    const res = value
      .split(/\r?\n/)
      .filter((i) => i.includes(";") && i.includes(":"));
    let arr: any = new Array(enums.length).fill(null);
    for (let i = 0; i < res.length; i++) {
      for (let j = 0; j < enums.length; j++) {
        if (res[i].includes(enums[j])) {
          arr.splice(j, 0, res[i]);
          break;
        }
      }
      if (!arr.includes(res[i])) {
        arr.splice(arr.length, 0, res[i]);
      }
    }
    return arr
      .filter((i: string) => i)
      .join("\n")
      .replaceAll(";", "");
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
      .slice(1);
    console.log(res);
    return res;
  };

  const showCopied = () => {
    setIsCopiedAlertShown(true);
    setTimeout(() => {
      setIsCopiedAlertShown(false);
    }, 3000);
  };

  useEffect(() => {
    setParsedValue(divideIntoBlocks(startValue));
  }, [startValue]);

  return (
    <div className="app">
      <textarea
        value={startValue}
        onChange={(e: any) => setStartValue(e.target.value)}
      />
      <div>
        <p>{isCopiedAlertShown ? "Copied to clipboard" : "Click to copy"}</p>
        <button
          onClick={async () => {
            showCopied();
            const text = document.querySelector("#text")?.textContent;
            if (text) await navigator.clipboard.writeText(text);
          }}
        >
          Copy to clipboard
        </button>
      </div>
      <textarea
        id="text"
        disabled
        value={parsedValue}
        onChange={(e: any) => setParsedValue(e.target.value)}
      />
    </div>
  );
};

export default App;
