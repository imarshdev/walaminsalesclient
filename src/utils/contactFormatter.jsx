export const formatSupplierContact = (value) => {
  const digits = value.replace(/\D/g, "");
  let formattedValue = digits.startsWith("07") ? "+256 7" : digits;
  const chunks = formattedValue.match(/(\+256\s7\d{0,3})|(\d{1,3})/g);
  if (chunks) {
    formattedValue = chunks.join(" ").trim();
  }
  return formattedValue;
};
