export const calculateAge = (birthDate) => {
  const hoy = new Date()
  const nacimiento = new Date(birthDate)

  let años = hoy.getFullYear() - nacimiento.getFullYear()
  let meses = hoy.getMonth() - nacimiento.getMonth()
  let dias = hoy.getDate() - nacimiento.getDate()

  // Ajustar por días negativos
  if (dias < 0) {
    meses--
    const ultimoDiaMesAnterior = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      0
    ).getDate()
    dias += ultimoDiaMesAnterior
  }

  // Ajustar por meses negativos
  if (meses < 0) {
    años--
    meses += 12
  }

  return {
    years: años,
    months: meses,
    days: dias,
    formattedAge: formatAge(años, meses, dias),
  }
}

const formatAge = (years, months, days) => {
  if (years < 1) {
    if (months < 1) {
      return `${days} días`
    }
    return `${months} meses y ${days} días`
  }
  return `${years} años${months > 0 ? ` y ${months} meses` : ''}`
}

export const calcularEdadPediatrica = (fechaNacimiento) => {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)

  // Cálculo preciso para pediatría
  let años = hoy.getFullYear() - nacimiento.getFullYear()
  let meses = hoy.getMonth() - nacimiento.getMonth()
  let dias = hoy.getDate() - nacimiento.getDate()

  // Ajustar por días negativos
  if (dias < 0) {
    meses--
    // Obtener último día del mes anterior
    const ultimoDiaMesAnterior = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      0
    ).getDate()
    dias += ultimoDiaMesAnterior
  }

  // Ajustar por meses negativos
  if (meses < 0) {
    años--
    meses += 12
  }

  // Meses completos (para percentiles)
  const completedMonths = años * 12 + meses

  // Meses con fracción (para visualización)
  const mesesDecimal = completedMonths + dias / 30.437

  // Cálculo de semanas y días
  const totalDias = Math.floor((hoy - nacimiento) / (1000 * 60 * 60 * 24))
  const semanasCompletas = Math.floor(totalDias / 7)
  const diasRestantes = totalDias % 7

  return {
    years: años,
    months: meses,
    days: dias,
    completedMonths: años * 12 + meses,
    monthsDecimal: parseFloat(mesesDecimal.toFixed(2)),
    weeks: semanasCompletas,
    remainingDays: diasRestantes,
    totalDays: totalDias,
  }
}
