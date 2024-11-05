import React, { useState, useEffect, useCallback } from "react";
import { useTransition, animated } from "react-spring";

const ALGORITHMS = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
};

const ARRAY_SIZES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200];
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];

function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(50);
  const [algorithm, setAlgorithm] = useState("");
  const [speed, setSpeed] = useState(1);
  const [sorting, setSorting] = useState(false);

  const generateArray = useCallback(() => {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(250 / speed);
        }
      }
    }
  };

  const selectionSort = async () => {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setArray([...arr]);
      await sleep(250 / speed);
    }
  };

  const insertionSort = async () => {
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
        setArray([...arr]);
        await sleep(250 / speed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      await sleep(250 / speed);
    }
  };

  const mergeSort = async () => {
    const merge = async (arr, l, m, r) => {
      const n1 = m - l + 1;
      const n2 = r - m;
      const L = arr.slice(l, m + 1);
      const R = arr.slice(m + 1, r + 1);
      let i = 0,
        j = 0,
        k = l;
      while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }
        k++;
        setArray([...arr]);
        await sleep(250 / speed);
      }
      while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
        setArray([...arr]);
        await sleep(250 / speed);
      }
      while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
        setArray([...arr]);
        await sleep(250 / speed);
      }
    };

    const mergeSortHelper = async (arr, l, r) => {
      if (l >= r) return;
      const m = l + Math.floor((r - l) / 2);
      await mergeSortHelper(arr, l, m);
      await mergeSortHelper(arr, m + 1, r);
      await merge(arr, l, m, r);
    };

    const arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
  };

  const quickSort = async () => {
    const partition = async (arr, low, high) => {
      const pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          await sleep(250 / speed);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await sleep(250 / speed);
      return i + 1;
    };

    const quickSortHelper = async (arr, low, high) => {
      if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
      }
    };

    const arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
  };

  const startSort = async () => {
    if (!algorithm) return;
    setSorting(true);
    switch (algorithm) {
      case "bubble":
        await bubbleSort();
        break;
      case "selection":
        await selectionSort();
        break;
      case "insertion":
        await insertionSort();
        break;
      case "merge":
        await mergeSort();
        break;
      case "quick":
        await quickSort();
        break;
    }
    setSorting(false);
  };

  const transitions = useTransition(
    array.map((value, index) => ({ value, index })),
    {
      key: (item) => item.index,
      from: { height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ value }) => ({ height: value * 3, opacity: 1 }),
      update: ({ value }) => ({ height: value * 3 }),
    }
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="bg-indigo-600 p-4">
        <h1 className="text-3xl font-bold text-center">Sorting Visualizer</h1>
      </header>
      <nav className="bg-indigo-500 p-4 flex flex-wrap justify-center items-center gap-4">
        <button
          onClick={generateArray}
          disabled={sorting}
          className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 disabled:opacity-50 transition-colors duration-300"
        >
          Generate Array
        </button>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="bg-white text-indigo-600 px-4 py-2 rounded-full"
        >
          <option value="">Choose algorithm</option>
          {Object.entries(ALGORITHMS).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
          className="bg-white text-indigo-600 px-4 py-2 rounded-full"
        >
          <option value="">Array size</option>
          {ARRAY_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="bg-white text-indigo-600 px-4 py-2 rounded-full"
        >
          <option value="">Speed</option>
          {SPEEDS.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>
        <button
          onClick={startSort}
          disabled={sorting || !algorithm}
          className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 disabled:opacity-50 transition-colors duration-300"
        >
          Sort
        </button>
      </nav>
      <main className="flex-1 p-4 flex items-center justify-center">
        <div className="w-full max-w-6xl h-[60vh] relative">
          {transitions((style, item) => (
            <animated.div
              key={item.index}
              style={{
                ...style,
                width: `${90 / arraySize}%`,
                marginLeft: "1px",
                marginRight: "1px",
                backgroundColor: "#4F46E5",
                position: "absolute",
                left: `${(item.index * 100) / arraySize}%`,
                bottom: 0,
              }}
            />
          ))}
        </div>
      </main>
      <footer className="bg-gray-800 p-4 text-center mt-auto">
        <p>Created by Mainak</p>
        <div className="mt-2">
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 mx-2 transition-colors duration-300"
          >
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 mx-2 transition-colors duration-300"
          >
            <i className="fab fa-github"></i> GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default SortingVisualizer;
