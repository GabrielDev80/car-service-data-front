export const hasAnyData = (data) => {
  /*   !data
    ? false
    : typeof data === "object"
      ? Object.keys(data).length > 0
      : false;
 */
  if (!data) return false;
  if (typeof data === "object") {
    return (
      Object.keys(data).length > 0 &&
      Object.values(data).some(
        (value) => value !== null && value !== undefined && value !== "",
      )
    );
  }
  return false;
};
