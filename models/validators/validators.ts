export const disallowNumbers = (arg: any) => {
  return isNaN(parseInt(arg));
};