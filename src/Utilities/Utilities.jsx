
export function miliSecondsToTimeString(timeInMiliSeconds) {
    var timeInSeconds = Math.round(timeInMiliSeconds / 1000);
    var seconds = Math.floor(timeInSeconds % 60)
    var minutes = Math.floor((timeInSeconds /60));
    var hours = Math.floor(minutes / 60);
    minutes = minutes%60;
    return hours + ":" + minutes + ":" + seconds
}