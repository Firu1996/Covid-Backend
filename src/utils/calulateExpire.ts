import moment from "moment";

export const calulateExpire = () => {
  const now = moment().format();
  const date = moment().add(1, "day").format("YYYY-MM-DD");
  const targetDate = moment(`${date} 07:25:00`).format();
  const diff = moment(targetDate).diff(moment(now));
  const sec = diff / 1000;
  return sec;
};
