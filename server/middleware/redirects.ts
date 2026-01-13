import { defineEventHandler, sendRedirect } from 'h3'

export default defineEventHandler((event) => {
  const url = event.node.req.url

  if (url === '/kode-otp') {
    return sendRedirect(event, '/my/kode-otp', 301) // 301 untuk pengalihan permanen
  }
})