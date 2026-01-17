export const createPageUrl = (pageName) => {
  return `/${pageName}`;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};
