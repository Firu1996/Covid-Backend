import moment from "moment";

const isSameDay = () => {
  const now = moment().format();
  const date = moment().format("YYYY-MM-DD");
  const targetDate = moment(`${date} 07:27:00`).format();
  const diff = moment(targetDate).diff(moment(now));
  const sec = diff / 1000;
  return sec;
};

export const calulateExpire = () => {
  const check = isSameDay();
  if (check <= 0) {
    const now = moment().format();
    const date = moment().add(1, "day").format("YYYY-MM-DD");
    const targetDate = moment(`${date} 07:27:00`).format();
    const diff = moment(targetDate).diff(moment(now));
    const sec = diff / 1000;
    return sec;
  } else {
    return check;
  }
};
