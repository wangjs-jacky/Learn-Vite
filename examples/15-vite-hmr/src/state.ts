// @ts-nocheck
let timer: number | undefined;

/* 缓存数据 */
if (!import.meta?.hot.data.count) {
  import.meta.hot.data.count = 0;
}

if (import.meta.hot) {
  // 当监听到当前模块变化时，需要手动清除定时器
  import.meta.hot.dispose(() => {
    if (timer) {
      clearInterval(timer);
    }
  });
}

/* export function initState() {
  let count = 0;
  timer = setInterval(() => {
    let countEle = document.getElementById("count");
    countEle!.innerText = ++count + "";
  }, 1000);
} */

export function initState() {
  // 每次 initState 刷新时，需从 import.meta.hot.data 上取数据
  const getAndIncCount = () => {
    const data = import.meta.hot?.data || {
      count: 0,
    };
    // 注：import.meta.hot.data 的引用地址
    data.count = data.count + 1;
    return data.count;
  };
  timer = setInterval(() => {
    let countEle = document.getElementById("count");
    countEle!.innerText = getAndIncCount() + "";
  }, 1000);
}
