/**
 * 
 * @param {*} strNum1 
 * @param {*} strNum2 
 * 1235
 *  345
 * 
 */
function bigNumberMul(strNum1, strNum2) {
    let result = '0'; // 用数组保存乘数每一位乘以被乘数的值

    for (let i = strNum2.length - 1; i >= 0; i--) {

        let addon = 0;
        let bitResultArr = [];
        for (let j = strNum1.length - 1; j >= 0; j--) {
            let bitMulResult = Number(strNum1[j]) * Number(strNum2[i]) + addon;
            addon = bitMulResult >= 10 ? (bitMulResult - bitMulResult % 10) / 10 : 0; // 每位相乘的进位
            bitResultArr.unshift(bitMulResult >= 10 ? bitMulResult % 10 : bitMulResult);
        }
        // 对于第i位，后面需要补上 strNum2.length - 1 - i 个 0
        for (let k = 0; k < strNum2.length - 1 - i; k++) {
            bitResultArr.push('0');
        }
        if (addon > 0) {
            bitResultArr.unshift(addon);
        }
        result = bigNumberAdd(result, bitResultArr.join(''));
    }

    console.log(result);
    return result;
}

/**
 * @description 大数相加
 * @param {string} strNum1 
 * @param {string} strNum2 
 */
function bigNumberAdd(strNum1, strNum2) {
    const numArr1 = strNum1.split('').reverse();
    const numArr2 = strNum2.split('').reverse();
    const result = [];
    let addon = 0; // 进位

    const maxLen = Math.max(strNum1.length, strNum2.length);
    for (let i = 0; i <= maxLen - 1; i++) {
        let temp = Number(numArr1[i] || 0) + Number(numArr2[i] || 0) + addon;
        addon = temp >= 10 ? 1 : 0;
        result.push(temp >= 10 ? temp - 10 : temp);
    }
    if (addon > 0) {
        result.push(addon);
    }
    return result.reverse().join('');
} 