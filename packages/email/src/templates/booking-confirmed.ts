import { baseTemplate } from './base'

interface BookingConfirmedData {
  userName: string
  className: string
  date: string
  time: string
  instructor: string
  room?: string
  orgName: string
}

export function bookingConfirmedTemplate(data: BookingConfirmedData) {
  const content = `
    <h1 class="title">¡Reserva confirmada!</h1>
    <p class="text">Hola ${data.userName}, tu reserva ha sido confirmada.</p>
    <div class="detail">
      <table width="100%" cellpadding="4" cellspacing="0" style="font-size:14px;">
        <tr><td style="color:#78716c;">Clase</td><td style="color:#1c1917;font-weight:500;text-align:right;">${data.className}</td></tr>
        <tr><td style="color:#78716c;">Fecha</td><td style="color:#1c1917;font-weight:500;text-align:right;">${data.date}</td></tr>
        <tr><td style="color:#78716c;">Horario</td><td style="color:#1c1917;font-weight:500;text-align:right;">${data.time}</td></tr>
        <tr><td style="color:#78716c;">Profesor/a</td><td style="color:#1c1917;font-weight:500;text-align:right;">${data.instructor}</td></tr>
        ${data.room ? `<tr><td style="color:#78716c;">Sala</td><td style="color:#1c1917;font-weight:500;text-align:right;">${data.room}</td></tr>` : ''}
      </table>
    </div>
    <p class="text">Recuerda llegar 5 minutos antes del inicio de la clase.</p>
  `
  return {
    subject: `Reserva confirmada: ${data.className} - ${data.date}`,
    html: baseTemplate(content, data.orgName),
  }
}
