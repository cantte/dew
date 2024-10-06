const errorMessages: { [key: string]: string } = {
  not_empty_string: 'Este campo no puede estar vacío',
  too_long_string: 'Este campo es demasiado largo',
  invalid_number: 'Este campo debe ser un número válido',
  must_be_positive_number: 'Este campo debe ser un número positivo',
  unit_required: 'Debe seleccionar una unidad',
  store_required: 'Debe seleccionar una tienda',
}

export const getErrorMessage = (
  errorKey: string,
  defaultMessage: string,
): string => {
  return errorMessages[errorKey] ?? defaultMessage
}
