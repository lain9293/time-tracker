const timeSum = (t1, t2) => {
  const [hT1, mT1] = t1.split(':').map(Number);
  const [hT2, mT2] = t2.split(':').map(Number);
  let rH = hT1 + hT2;
  let rM = mT1 + mT2;
  if (rM >= 60) {
    rH++;
    rM -= 60;
  }
  return `${rH < 10 ? '0' + rH : rH}:${rM < 10 ? '0' + rM : rM}`;
}

export default timeSum;