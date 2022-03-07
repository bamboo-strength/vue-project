const TO_SELECT_FORMAT = (value: any, data: any) => {
  if (!value || value === null) {
    return null;
  }
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === value) {
      return data[i].value;
    }
  }
};

export const convert = {
  TO_SELECT_FORMAT
};
