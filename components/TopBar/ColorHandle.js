/**
 * Created by yuanzhou.xu on 2017/9/15.
 */

export function rgbTranform(startColor, endColor, size) {
  let startR = parseInt(startColor.replace('#', '').substring(0, 2), 16);
  let startG = parseInt(startColor.replace('#', '').substring(2, 4), 16);
  let startB = parseInt(startColor.replace('#', '').substring(4), 16);
  let endR = parseInt(endColor.replace('#', '').substring(0, 2), 16);
  let endG = parseInt(endColor.replace('#', '').substring(2, 4), 16);
  let endB = parseInt(endColor.replace('#', '').substring(4), 16);
  let diffL = 1 / (size + 1);
  let locationDiff = diffL;
  let locationArray = [];
  let colorArray = [];
  //colorArray.push(startColor);
  //locationArray.push(0);
  for (let i = 0; i < size; i++) {
    let R = startR + Math.ceil((endR - startR) / size * i);
    let G = startG + Math.ceil((endG - startG) / size * i);
    let B = startB + Math.ceil((endB - startB) / size * i);
    colorArray.push('rgb(' + R + ',' + G + ',' + B + ')');
    if (locationDiff.toFixed(2) >= 1) {
      locationArray.push(1);
    } else {
      locationArray.push(Number(locationDiff.toFixed(2)));
    }
    locationDiff += diffL;
  }
  colorArray.push(endColor);
  locationArray.push(1);

  let obj = {
    locations: locationArray,
    colors: colorArray
  };
  return obj;
}