const weightedResult = function(ratio, interests) {
  let int1 = interests[0].toString();
  let int2 = interests[1].toString();
  let int3 = interests[2].toString();
  result = {};
  //Returns a weighted amount of ads, priortiy their main interest first
  if (ratio === 1) { result[int1] = 1 }
  if (ratio === 2) { result[int1] = 1; result[int2] = 1 }
  if (ratio === 3) { result[int1] = 1; result[int2] = 1; result[int3] = 1; }
  if (ratio === 4) { result[int1] = 2; result[int2] = 1; result[int3] = 1; }
  if (ratio === 5) { result[int1] = 2; result[int2] = 2; result[int3] = 1; }
  if (ratio === 6) { result[int1] = 3; result[int2] = 2; result[int3] = 1; }
  if (ratio === 7) { result[int1] = 4; result[int2] = 2; result[int3] = 1; }
  if (ratio === 8) { result[int1] = 4; result[int2] = 2; result[int3] = 2; }
  //if ratio is above the max 8, we are looking to populate the database with active ads during the initialization phase
  if (ratio === 9 ) { result[int1] = 5; }
  if (ratio > 10) { result[int1] = ratio; }
  return result;
};


const getGroupIdAndAmount = (array) => {
  let result = {};
  array.forEach((ad)=> {
    if (result[ad.ad_group_id] === undefined) {
      result[ad.ad_group_id] = 0
    }
    result[ad.ad_group_id] += 1;
  })
  return result;
}

module.exports = {
  weightedResult,
  getGroupIdAndAmount
};