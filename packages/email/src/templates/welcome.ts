import { baseTemplate } from './base'

interface WelcomeData {
  userName: string
  orgName: string
  loginUrl: string
}

export function welcomeTemplate(data: WelcomeData) {
  const content = `
    <h1 class="title">¡Bienvenido/a a ${data.orgName}!</h1>
    <p class="text">Hola ${data.userName}, tu cuenta ha sido creada correctamente. Ya puedes empezar a reservar clases.</p>
    <p style="margin: 24px 0;">
      <a href="${data.loginUrl}" class="button">Ver horarios y reservar</a>
    </p>
    <p class="text">Si tienes alguna duda, no dudes en contactarnos.</p>
  `
  return {
    subject: `Bienvenido/a a ${data.orgName}`,
    html: baseTemplate(content, data.orgName),
  }
}
