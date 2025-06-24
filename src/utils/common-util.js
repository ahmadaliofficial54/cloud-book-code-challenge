export const constructQueryString = (params, key) => {
  const queryParts = [];
  if (key && params[key]) {
    queryParts.push(`${key}=${encodeURIComponent(params[key])}`);
  }

  return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
};

export const constructQueryStringWithObject = (params) => {
  const queryParts = [];

  for (const key in params) {
    if (params[key]) {
      queryParts.push(`${key}=${encodeURIComponent(params[key])}`);
    }
  }

  return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
};

export const exportToCSV = (data, filename = "payment.csv", onProgress) => {
  const csvString = data
    .map((row, index) => {
      if (typeof onProgress === "function") {
        const progress = (index + 1) / data.length;
        onProgress(progress);
      }
      return row.join(",");
    })
    .join("\n");

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);

  document.body.appendChild(link);

  link.click();

  link.parentNode.removeChild(link);
};

export const prepareDataForCSV = (headers, data) => {
  return [headers, ...data];
};

export function createFilterQueryString(filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "object" && value !== null) {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (subValue !== null && subValue !== undefined) {
          params.append(`appliedFilter[${key}][${subKey}]`, subValue);
        }
      }
    } else {
      if (value !== null && value !== undefined) {
        params.append(`${key}`, value);
      }
    }
  }
  return params.toString();
}

export function buildSectionTree(sections) {
  const sectionMap = {};
  sections.forEach(section => sectionMap[section.id] = { ...section, children: [] });
  const tree = [];
  sections.forEach(section => {
    if (section.parentId) {
      if (sectionMap[section.parentId]) {
        sectionMap[section.parentId].children.push(sectionMap[section.id]);
      }
    } else {
      tree.push(sectionMap[section.id]);
    }
  });
  return tree;
}
