import { baseTemplate } from './base'

interface BookingCancelledData {
  userName: string
  className: string
  date: string
  time: string
  orgName: string
}

export function bookingCancelledTemplate(data: BookingCancelledData) {
  const content = `
    <h1 class="title">Reserva cancelada</h1>
    <p class="text">Hola ${data.userName}, tu reserva ha sido cancelada correctamente.</p>
    <div class="detail">
      <table width="100%" cellpadding="4" cellspacing="0" style="font-size:14px;">
        <tr><td style="color:#78716c;">Clase</td><td style="color:#1c1917;font-weight:500;text-align:right;">${data.className}</td></tr>
        <tr><td style="color:#78716c;">Fecha</td><td style="color:#1c1917;font-weight:500;text-align:right;">${data.date}</td></tr>
        <tr><td style="color:#78716c;">Horario</td><td style="color:#1c1917;font-weight:500;text-align:right;">${data.time}</td></tr>
      </table>
    </div>
    <p class="text">Si fue un error, puedes volver a reservar desde tu panel.</p>
  `
  return {
    subject: `Reserva cancelada: ${data.className} - ${data.date}`,
    html: baseTemplate(content, data.orgName),
  }
}
