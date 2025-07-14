export function parseISOString(isoString) {
  // The Date constructor natively parses ISO 8601 strings in modern JavaScript engines :contentReference[oaicite:0]{index=0}.
  const dateObj = new Date(isoString);

  // Helper to zero-pad numbers to two digits
  const pad2 = (num) => String(num).padStart(2, "0");

  // Extract components in UTC (since the string ends with 'Z')
  const year = dateObj.getUTCFullYear();
  const month = pad2(dateObj.getUTCMonth() + 1); // Months are zero-indexed :contentReference[oaicite:1]{index=1}.
  const day = pad2(dateObj.getUTCDate());
  const hour = pad2(dateObj.getUTCHours());
  const minute = pad2(dateObj.getUTCMinutes());
  const second = pad2(dateObj.getUTCSeconds());

  return {
    date: `${year}-${month}-${day}`, // e.g. "2024-06-12"
    time: `${hour}:${minute}:${second}`, // e.g. "22:57:38"
  };
}

export const tagPantryProducts = (normalProducts, pantryProducts) => {
  const favouriteIds = new Set(
    pantryProducts.map((item) => item?.product?._id)
  );
  const filteredProducts = normalProducts.map((item) => ({
    ...item,
    isPantry: favouriteIds.has(item._id),
  }));
  console.log("favouriteIds", favouriteIds);
  console.log("Filtered prods", filteredProducts);
  return filteredProducts;
};
