# Chat API Documentation
# Endpoint Reference & Nuxt.js Integration Guide

**Authentication:**
- Customer (V1): `Authorization: Bearer {sanctum_token}`
- CMS Admin: `X-API-KEY: {api_key}` atau `Authorization: Bearer {token}`

**Content-Type:**
- JSON: `application/json`
- Upload file: `multipart/form-data`

---

## Daftar Isi

1. [Customer API (V1)](#1-customer-api-v1)
2. [CMS Admin API](#2-cms-admin-api)
3. [WebSocket Real-Time Events](#3-websocket-real-time-events)
4. [Nuxt.js Integration Guide](#4-nuxtjs-integration-guide)

---

## 1. Customer API (V1)

Base URL: `/api/v1`

### 1.1 List Conversations

Mengambil daftar percakapan milik customer.

```
GET /api/v1/chat/conversations
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Default | Keterangan |
|-----------|------|---------|------------|
| paginate | integer | 10 | Jumlah per halaman |
| page | integer | 1 | Halaman ke-n |

**Response (200):**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "brand_id": 1,
        "anggota_id": 5,
        "subject": "Tanya pinjaman",
        "status": "open",
        "last_message_at": "2026-02-27T08:30:00.000000Z",
        "created_at": "2026-02-27T07:00:00.000000Z",
        "updated_at": "2026-02-27T08:30:00.000000Z",
        "unread_count": 2,
        "latest_message": {
          "id": 15,
          "chat_conversation_id": 1,
          "user_id": 1,
          "sender_type": "admin",
          "body": "Silakan lengkapi dokumen Anda",
          "read_at": null,
          "created_at": "2026-02-27T08:30:00.000000Z",
          "updated_at": "2026-02-27T08:30:00.000000Z"
        }
      }
    ],
    "first_page_url": "http://localhost/api/v1/chat/conversations?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/v1/chat/conversations?page=1",
    "next_page_url": null,
    "per_page": 10,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```

---

### 1.2 Create / Open Conversation

Membuat percakapan baru atau mengembalikan percakapan open yang sudah ada (menggunakan `firstOrCreate`).

```
POST /api/v1/chat/conversations
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "subject": "Tanya status pinjaman"
}
```

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| subject | string | Tidak | Topik percakapan (max 255 karakter) |

**Response - Created (201):**
```json
{
  "code": 201,
  "message": "Created",
  "data": {
    "id": 1,
    "brand_id": 1,
    "anggota_id": 5,
    "subject": "Tanya status pinjaman",
    "status": "open",
    "last_message_at": "2026-02-27T07:00:00.000000Z",
    "created_at": "2026-02-27T07:00:00.000000Z",
    "updated_at": "2026-02-27T07:00:00.000000Z"
  }
}
```

> **Note:** Jika customer sudah punya conversation dengan status `open`, endpoint ini akan mengembalikan conversation yang sudah ada, bukan membuat baru.

---

### 1.3 Get Messages

Mengambil daftar pesan dalam sebuah percakapan. Otomatis menandai pesan dari admin sebagai sudah dibaca.

```
GET /api/v1/chat/conversations/{conversation_id}/messages
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Default | Keterangan |
|-----------|------|---------|------------|
| paginate | integer | 20 | Jumlah per halaman |
| page | integer | 1 | Halaman ke-n |

**Response (200):**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 15,
        "chat_conversation_id": 1,
        "user_id": 1,
        "sender_type": "admin",
        "body": "Silakan lengkapi dokumen Anda",
        "read_at": "2026-02-27T09:00:00.000000Z",
        "created_at": "2026-02-27T08:30:00.000000Z",
        "updated_at": "2026-02-27T09:00:00.000000Z",
        "attachments": [],
        "sender": {
          "id": 1,
          "name": "Admin"
        }
      },
      {
        "id": 14,
        "chat_conversation_id": 1,
        "user_id": 10,
        "sender_type": "customer",
        "body": null,
        "read_at": "2026-02-27T08:31:00.000000Z",
        "created_at": "2026-02-27T08:00:00.000000Z",
        "updated_at": "2026-02-27T08:31:00.000000Z",
        "attachments": [
          "http://localhost/storage/media/123/foto-ktp.jpg"
        ],
        "sender": {
          "id": 10,
          "name": "Budi"
        }
      }
    ],
    "first_page_url": "...",
    "from": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 2
  }
}
```

> **Note:** Pesan diurutkan dari terbaru ke terlama (`desc`). Di frontend, reverse array untuk tampilan chat.

---

### 1.4 Send Message

Mengirim pesan baru (teks dan/atau gambar).

```
POST /api/v1/chat/conversations/{conversation_id}/messages
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| body | string | Wajib jika tanpa image | Isi pesan (max 5000 karakter) |
| image | file | Wajib jika tanpa body | Gambar (jpeg,png,jpg,gif,heif,heic, max 10MB) |

**Contoh: Kirim teks saja**
```
body: "Halo, saya mau tanya soal pinjaman"
```

**Contoh: Kirim gambar saja**
```
image: [file]
```

**Contoh: Kirim teks + gambar**
```
body: "Ini bukti transfer saya"
image: [file]
```

**Response - Created (201):**
```json
{
  "code": 201,
  "message": "Created",
  "data": {
    "id": 16,
    "chat_conversation_id": 1,
    "user_id": 10,
    "sender_type": "customer",
    "body": "Halo, saya mau tanya soal pinjaman",
    "read_at": null,
    "created_at": "2026-02-27T09:00:00.000000Z",
    "updated_at": "2026-02-27T09:00:00.000000Z",
    "attachments": []
  }
}
```

**Response - Created dengan gambar (201):**
```json
{
  "code": 201,
  "message": "Created",
  "data": {
    "id": 17,
    "chat_conversation_id": 1,
    "user_id": 10,
    "sender_type": "customer",
    "body": "Ini bukti transfer saya",
    "read_at": null,
    "created_at": "2026-02-27T09:01:00.000000Z",
    "updated_at": "2026-02-27T09:01:00.000000Z",
    "attachments": [
      "http://localhost/storage/media/124/bukti-transfer.jpg"
    ]
  }
}
```

**Response - Validation Error (422):**
```json
{
  "message": "The body field is required when image is not present.",
  "errors": {
    "body": ["The body field is required when image is not present."]
  }
}
```

---

### 1.5 Unread Count

Mengambil jumlah pesan belum dibaca dari admin.

```
GET /api/v1/chat/unread-count
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "unread_count": 3
  }
}
```

---

## 2. CMS Admin API

Base URL: `/api/cms`

### 2.1 List Conversations

Mengambil daftar semua percakapan (di-scope berdasarkan brand admin).

```
GET /api/cms/chat/conversations
X-API-KEY: {api_key}
```

**Query Parameters:**
| Parameter | Type | Default | Keterangan |
|-----------|------|---------|------------|
| paginate | integer | 20 | Jumlah per halaman |
| page | integer | 1 | Halaman ke-n |
| status | string | - | Filter: `open` atau `closed` |
| search | string | - | Cari berdasarkan nama anggota |

**Response (200):**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "brand_id": 1,
        "anggota_id": 5,
        "anggota_name": "Budi Santoso",
        "anggota_phone": "081234567890",
        "subject": "Tanya pinjaman",
        "status": "open",
        "unread_count": 3,
        "last_message": {
          "body": "Halo, saya mau tanya soal pinjaman",
          "sender_type": "customer",
          "created_at": "2026-02-27T09:00:00.000000Z"
        },
        "last_message_at": "2026-02-27T09:00:00.000000Z",
        "created_at": "2026-02-27T07:00:00.000000Z"
      },
      {
        "id": 2,
        "brand_id": 1,
        "anggota_id": 8,
        "anggota_name": "Siti Rahayu",
        "anggota_phone": "081298765432",
        "subject": null,
        "status": "open",
        "unread_count": 0,
        "last_message": {
          "body": "Terima kasih infonya",
          "sender_type": "customer",
          "created_at": "2026-02-26T15:00:00.000000Z"
        },
        "last_message_at": "2026-02-26T15:00:00.000000Z",
        "created_at": "2026-02-26T10:00:00.000000Z"
      }
    ],
    "per_page": 20,
    "total": 2
  }
}
```

---

### 2.2 Get Messages

Mengambil daftar pesan dalam percakapan. Otomatis menandai pesan dari customer sebagai sudah dibaca.

```
GET /api/cms/chat/conversations/{conversation_id}/messages
X-API-KEY: {api_key}
```

**Query Parameters:**
| Parameter | Type | Default | Keterangan |
|-----------|------|---------|------------|
| paginate | integer | 30 | Jumlah per halaman |
| page | integer | 1 | Halaman ke-n |

**Response (200):**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 16,
        "conversation_id": 1,
        "user_id": 10,
        "sender_name": "Budi Santoso",
        "sender_type": "customer",
        "body": "Halo, saya mau tanya soal pinjaman",
        "attachments": [],
        "read_at": "2026-02-27T09:05:00.000000Z",
        "created_at": "2026-02-27T09:00:00.000000Z"
      },
      {
        "id": 17,
        "conversation_id": 1,
        "user_id": 1,
        "sender_name": "Admin",
        "sender_type": "admin",
        "body": "Halo Budi, silakan ajukan di menu Pinjaman",
        "attachments": [],
        "read_at": null,
        "created_at": "2026-02-27T09:05:30.000000Z"
      },
      {
        "id": 18,
        "conversation_id": 1,
        "user_id": 10,
        "sender_name": "Budi Santoso",
        "sender_type": "customer",
        "body": null,
        "attachments": [
          "http://localhost/storage/media/125/screenshot.jpg"
        ],
        "read_at": "2026-02-27T09:10:00.000000Z",
        "created_at": "2026-02-27T09:08:00.000000Z"
      }
    ],
    "per_page": 30,
    "total": 3
  }
}
```

---

### 2.3 Send Message (Admin Reply)

Admin mengirim balasan pesan.

```
POST /api/cms/chat/conversations/{conversation_id}/messages
X-API-KEY: {api_key}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| body | string | Wajib jika tanpa image | Isi pesan (max 5000 karakter) |
| image | file | Wajib jika tanpa body | Gambar (jpeg,png,jpg,gif,heif,heic, max 10MB) |

**Response - Created (201):**
```json
{
  "code": 201,
  "message": "Created",
  "data": {
    "id": 19,
    "conversation_id": 1,
    "user_id": 1,
    "sender_name": "Admin",
    "sender_type": "admin",
    "body": "Dokumen sudah kami terima, terima kasih",
    "attachments": [],
    "read_at": null,
    "created_at": "2026-02-27T09:15:00.000000Z"
  }
}
```

---

### 2.4 Close Conversation

Menutup percakapan. Customer tidak bisa mengirim pesan lagi ke conversation ini.

```
PUT /api/cms/chat/conversations/{conversation_id}/close
X-API-KEY: {api_key}
```

**Response (200):**
```json
{
  "code": 200,
  "message": "Conversation closed",
  "data": null
}
```

---

### 2.5 Unread Count

Mengambil jumlah pesan belum dibaca dari customer (brand-scoped).

```
GET /api/cms/chat/unread-count
X-API-KEY: {api_key}
```

**Response (200):**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "unread_count": 5
  }
}
```

---

## 3. WebSocket Real-Time Events

### Setup

WebSocket server menggunakan **Laravel Reverb**.

**Connection:**
```
Host: REVERB_HOST (default: localhost)
Port: REVERB_PORT (default: 8080)
Key:  REVERB_APP_KEY
```

### Channel: `private-chat.conversation.{conversation_id}`

Listen event ini untuk menerima pesan baru secara real-time di dalam percakapan yang sedang dibuka.

**Event Name:** `NewChatMessage`

**Payload:**
```json
{
  "id": 20,
  "conversation_id": 1,
  "sender_type": "admin",
  "user_id": 1,
  "body": "Pesan baru dari admin",
  "attachments": ["http://localhost/storage/media/126/foto.jpg"],
  "created_at": "2026-02-27T10:00:00.000000Z"
}
```

### Channel: `private-chat.brand.{brand_id}`

Listen event ini untuk update daftar conversation (pesan baru masuk, unread count berubah).

**Event Name:** `ConversationUpdated`

**Payload:**
```json
{
  "conversation_id": 1,
  "anggota_name": "Budi Santoso",
  "last_message_at": "2026-02-27T10:00:00.000000Z",
  "unread_count": 4
}
```

### Channel: `private-chat.customer.{user_id}`

Channel untuk customer app (mobile/web) menerima notifikasi pesan baru.

---

## 4. Nuxt.js Integration Guide

### 4.1 Install Dependencies

```bash
npm install laravel-echo pusher-js
```

### 4.2 Echo Plugin

Buat file `plugins/echo.client.ts`:

```typescript
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  window.Pusher = Pusher

  const config = useRuntimeConfig()

  const echo = new Echo({
    broadcaster: 'reverb',
    key: config.public.reverbAppKey,
    wsHost: config.public.reverbHost,
    wsPort: config.public.reverbPort ?? 80,
    wssPort: config.public.reverbPort ?? 443,
    forceTLS: (config.public.reverbScheme ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${config.public.apiBase}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${useCookie('token').value}`,
      },
    },
  })

  return {
    provide: {
      echo,
    },
  }
})
```

### 4.3 Nuxt Config

Tambahkan di `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000',
      reverbAppKey: process.env.REVERB_APP_KEY || 'my-app-key',
      reverbHost: process.env.REVERB_HOST || 'localhost',
      reverbPort: process.env.REVERB_PORT || '8080',
      reverbScheme: process.env.REVERB_SCHEME || 'http',
    },
  },
})
```

### 4.4 Chat Composable

Buat file `composables/useChat.ts`:

```typescript
interface Conversation {
  id: number
  brand_id: number
  anggota_id: number
  anggota_name?: string
  anggota_phone?: string
  subject: string | null
  status: 'open' | 'closed'
  unread_count: number
  last_message?: {
    body: string | null
    sender_type: 'customer' | 'admin'
    created_at: string
  }
  last_message_at: string | null
  created_at: string
}

interface Message {
  id: number
  conversation_id: number
  user_id: number
  sender_name: string
  sender_type: 'customer' | 'admin'
  body: string | null
  attachments: string[]
  read_at: string | null
  created_at: string
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface PaginatedData<T> {
  current_page: number
  data: T[]
  last_page: number
  per_page: number
  total: number
}

export const useChat = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  const baseUrl = config.public.apiBase

  // --- Shared headers ---
  const headers = computed(() => ({
    Authorization: `Bearer ${token.value}`,
    Accept: 'application/json',
  }))

  // =============================================
  // CUSTOMER API (V1) - untuk mobile/customer app
  // =============================================

  const customerApi = {
    // List conversations
    async getConversations(page = 1, paginate = 10) {
      return await $fetch<ApiResponse<PaginatedData<Conversation>>>(
        `${baseUrl}/api/v1/chat/conversations`,
        {
          headers: headers.value,
          params: { page, paginate },
        }
      )
    },

    // Create or get open conversation
    async createConversation(subject?: string) {
      return await $fetch<ApiResponse<Conversation>>(
        `${baseUrl}/api/v1/chat/conversations`,
        {
          method: 'POST',
          headers: headers.value,
          body: { subject },
        }
      )
    },

    // Get messages in a conversation
    async getMessages(conversationId: number, page = 1, paginate = 20) {
      return await $fetch<ApiResponse<PaginatedData<Message>>>(
        `${baseUrl}/api/v1/chat/conversations/${conversationId}/messages`,
        {
          headers: headers.value,
          params: { page, paginate },
        }
      )
    },

    // Send message (text only)
    async sendTextMessage(conversationId: number, body: string) {
      return await $fetch<ApiResponse<Message>>(
        `${baseUrl}/api/v1/chat/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: headers.value,
          body: { body },
        }
      )
    },

    // Send message with image
    async sendImageMessage(conversationId: number, image: File, body?: string) {
      const formData = new FormData()
      formData.append('image', image)
      if (body) formData.append('body', body)

      return await $fetch<ApiResponse<Message>>(
        `${baseUrl}/api/v1/chat/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`,
            // Jangan set Content-Type, browser otomatis set multipart/form-data
          },
          body: formData,
        }
      )
    },

    // Get unread count
    async getUnreadCount() {
      return await $fetch<ApiResponse<{ unread_count: number }>>(
        `${baseUrl}/api/v1/chat/unread-count`,
        { headers: headers.value }
      )
    },
  }

  // =============================================
  // CMS ADMIN API - untuk admin dashboard
  // =============================================

  const adminApi = {
    // List all conversations (brand-scoped)
    async getConversations(params?: {
      page?: number
      paginate?: number
      status?: 'open' | 'closed'
      search?: string
    }) {
      return await $fetch<ApiResponse<PaginatedData<Conversation>>>(
        `${baseUrl}/api/cms/chat/conversations`,
        {
          headers: headers.value,
          params,
        }
      )
    },

    // Get messages
    async getMessages(conversationId: number, page = 1, paginate = 30) {
      return await $fetch<ApiResponse<PaginatedData<Message>>>(
        `${baseUrl}/api/cms/chat/conversations/${conversationId}/messages`,
        {
          headers: headers.value,
          params: { page, paginate },
        }
      )
    },

    // Send reply
    async sendTextMessage(conversationId: number, body: string) {
      return await $fetch<ApiResponse<Message>>(
        `${baseUrl}/api/cms/chat/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: headers.value,
          body: { body },
        }
      )
    },

    // Send reply with image
    async sendImageMessage(conversationId: number, image: File, body?: string) {
      const formData = new FormData()
      formData.append('image', image)
      if (body) formData.append('body', body)

      return await $fetch<ApiResponse<Message>>(
        `${baseUrl}/api/cms/chat/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          body: formData,
        }
      )
    },

    // Close conversation
    async closeConversation(conversationId: number) {
      return await $fetch<ApiResponse<null>>(
        `${baseUrl}/api/cms/chat/conversations/${conversationId}/close`,
        {
          method: 'PUT',
          headers: headers.value,
        }
      )
    },

    // Get unread count
    async getUnreadCount() {
      return await $fetch<ApiResponse<{ unread_count: number }>>(
        `${baseUrl}/api/cms/chat/unread-count`,
        { headers: headers.value }
      )
    },
  }

  return { customerApi, adminApi }
}
```

### 4.5 Customer Chat Page

Contoh halaman chat untuk customer app (`pages/chat.vue`):

```vue
<script setup lang="ts">
const { customerApi } = useChat()
const { $echo } = useNuxtApp()

const conversation = ref(null)
const messages = ref([])
const messageBody = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const chatContainer = ref<HTMLElement | null>(null)
const loading = ref(false)

// Buka atau buat conversation
async function initChat() {
  const res = await customerApi.createConversation()
  conversation.value = res.data
  await loadMessages()
  listenForMessages()
}

// Load pesan
async function loadMessages() {
  if (!conversation.value) return
  const res = await customerApi.getMessages(conversation.value.id)
  messages.value = res.data.data.reverse() // Reverse karena API return desc
  scrollToBottom()
}

// Kirim pesan
async function sendMessage() {
  if (!conversation.value) return
  if (!messageBody.value && !imageFile.value) return

  loading.value = true
  try {
    if (imageFile.value) {
      await customerApi.sendImageMessage(
        conversation.value.id,
        imageFile.value,
        messageBody.value || undefined
      )
    } else {
      await customerApi.sendTextMessage(conversation.value.id, messageBody.value)
    }

    messageBody.value = ''
    imageFile.value = null
    imagePreview.value = null
    await loadMessages()
  } finally {
    loading.value = false
  }
}

// Handle file input
function onFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

// Scroll ke bawah
function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Listen real-time messages via WebSocket
function listenForMessages() {
  if (!$echo || !conversation.value) return

  $echo
    .private(`chat.conversation.${conversation.value.id}`)
    .listen('NewChatMessage', (event: any) => {
      // Tambah pesan baru ke list
      messages.value.push({
        id: event.id,
        conversation_id: event.conversation_id,
        user_id: event.user_id,
        sender_name: '',
        sender_type: event.sender_type,
        body: event.body,
        attachments: event.attachments,
        read_at: null,
        created_at: event.created_at,
      })
      scrollToBottom()
    })
}

// Cleanup WebSocket listener
onUnmounted(() => {
  if ($echo && conversation.value) {
    $echo.leave(`chat.conversation.${conversation.value.id}`)
  }
})

onMounted(() => {
  initChat()
})
</script>

<template>
  <div class="chat-container">
    <!-- Messages -->
    <div ref="chatContainer" class="messages-area">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', msg.sender_type === 'customer' ? 'sent' : 'received']"
      >
        <!-- Image attachments -->
        <img
          v-for="url in msg.attachments"
          :key="url"
          :src="url"
          class="message-image"
          @click="window.open(url, '_blank')"
        />
        <!-- Text body -->
        <p v-if="msg.body">{{ msg.body }}</p>
        <span class="time">
          {{ new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
        </span>
      </div>
    </div>

    <!-- Image preview -->
    <div v-if="imagePreview" class="image-preview">
      <img :src="imagePreview" />
      <button @click="imageFile = null; imagePreview = null">Hapus</button>
    </div>

    <!-- Input area -->
    <div class="input-area">
      <label class="attach-btn">
        <input type="file" accept="image/*" hidden @change="onFileSelect" />
        📎
      </label>
      <textarea
        v-model="messageBody"
        placeholder="Ketik pesan..."
        rows="1"
        @keydown.enter.prevent="sendMessage"
      />
      <button :disabled="loading" @click="sendMessage">Kirim</button>
    </div>
  </div>
</template>
```

### 4.6 CMS Admin Chat Page

Contoh halaman chat admin (`pages/cms/chat.vue`):

```vue
<script setup lang="ts">
const { adminApi } = useChat()
const { $echo } = useNuxtApp()
const user = useAuthUser() // composable untuk user yang login

const conversations = ref([])
const activeConversation = ref(null)
const messages = ref([])
const messageBody = ref('')
const imageFile = ref<File | null>(null)
const searchQuery = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const loading = ref(false)

// Load daftar conversation
async function loadConversations() {
  const res = await adminApi.getConversations({
    search: searchQuery.value || undefined,
    status: 'open',
  })
  conversations.value = res.data.data
}

// Pilih conversation
async function selectConversation(conv: any) {
  activeConversation.value = conv
  await loadMessages()
  listenForMessages()
}

// Load pesan
async function loadMessages() {
  if (!activeConversation.value) return
  const res = await adminApi.getMessages(activeConversation.value.id)
  messages.value = res.data.data.reverse()
  scrollToBottom()

  // Reset unread count di list
  const conv = conversations.value.find((c: any) => c.id === activeConversation.value.id)
  if (conv) conv.unread_count = 0
}

// Kirim pesan
async function sendMessage() {
  if (!activeConversation.value) return
  if (!messageBody.value && !imageFile.value) return

  loading.value = true
  try {
    if (imageFile.value) {
      await adminApi.sendImageMessage(
        activeConversation.value.id,
        imageFile.value,
        messageBody.value || undefined,
      )
    } else {
      await adminApi.sendTextMessage(activeConversation.value.id, messageBody.value)
    }

    messageBody.value = ''
    imageFile.value = null
    await loadMessages()
  } finally {
    loading.value = false
  }
}

// Tutup conversation
async function closeConversation() {
  if (!activeConversation.value) return
  await adminApi.closeConversation(activeConversation.value.id)
  activeConversation.value.status = 'closed'
  await loadConversations()
}

// Listen pesan baru di conversation aktif
function listenForMessages() {
  if (!$echo || !activeConversation.value) return

  // Leave previous channel
  $echo.leave(`chat.conversation.${activeConversation.value.id}`)

  $echo
    .private(`chat.conversation.${activeConversation.value.id}`)
    .listen('NewChatMessage', (event: any) => {
      messages.value.push({
        id: event.id,
        conversation_id: event.conversation_id,
        user_id: event.user_id,
        sender_name: '',
        sender_type: event.sender_type,
        body: event.body,
        attachments: event.attachments,
        read_at: null,
        created_at: event.created_at,
      })
      scrollToBottom()
    })
}

// Listen update conversation list (pesan baru di conversation lain)
function listenForConversationUpdates() {
  if (!$echo || !user.value?.brand?.id) return

  $echo
    .private(`chat.brand.${user.value.brand.id}`)
    .listen('ConversationUpdated', () => {
      loadConversations()
    })
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Debounce search
let searchTimeout: NodeJS.Timeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => loadConversations(), 500)
})

onMounted(() => {
  loadConversations()
  listenForConversationUpdates()
})

onUnmounted(() => {
  if ($echo) {
    if (activeConversation.value) {
      $echo.leave(`chat.conversation.${activeConversation.value.id}`)
    }
    if (user.value?.brand?.id) {
      $echo.leave(`chat.brand.${user.value.brand.id}`)
    }
  }
})
</script>

<template>
  <div class="chat-layout">
    <!-- Left: Conversation List -->
    <div class="conversation-list">
      <div class="search-box">
        <input v-model="searchQuery" placeholder="Cari anggota..." />
      </div>

      <div
        v-for="conv in conversations"
        :key="conv.id"
        :class="['conversation-item', { active: activeConversation?.id === conv.id }]"
        @click="selectConversation(conv)"
      >
        <div class="conv-header">
          <strong>{{ conv.anggota_name }}</strong>
          <small>{{ new Date(conv.last_message_at).toLocaleDateString('id-ID') }}</small>
        </div>
        <div class="conv-preview">
          <span>{{ conv.last_message?.body || 'Image' }}</span>
          <span v-if="conv.unread_count > 0" class="badge">{{ conv.unread_count }}</span>
        </div>
      </div>
    </div>

    <!-- Right: Chat Area -->
    <div class="chat-area">
      <template v-if="activeConversation">
        <!-- Header -->
        <div class="chat-header">
          <div>
            <h3>{{ activeConversation.anggota_name }}</h3>
            <small>{{ activeConversation.anggota_phone }}</small>
          </div>
          <div>
            <span :class="['status', activeConversation.status]">
              {{ activeConversation.status }}
            </span>
            <button
              v-if="activeConversation.status === 'open'"
              @click="closeConversation"
            >
              Tutup Chat
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div ref="chatContainer" class="messages-area">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message', msg.sender_type === 'admin' ? 'sent' : 'received']"
          >
            <img
              v-for="url in msg.attachments"
              :key="url"
              :src="url"
              class="message-image"
            />
            <p v-if="msg.body">{{ msg.body }}</p>
            <span class="time">
              {{ new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
              <span v-if="msg.sender_type === 'admin' && msg.read_at">✓✓</span>
            </span>
          </div>
        </div>

        <!-- Input -->
        <div v-if="activeConversation.status === 'open'" class="input-area">
          <label class="attach-btn">
            <input type="file" accept="image/*" hidden @change="onFileSelect" />
            📎
          </label>
          <textarea
            v-model="messageBody"
            placeholder="Ketik pesan..."
            rows="2"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <button :disabled="loading" @click="sendMessage">Kirim</button>
        </div>
        <div v-else class="closed-notice">
          Percakapan sudah ditutup
        </div>
      </template>

      <div v-else class="empty-state">
        <p>Pilih percakapan untuk mulai chat</p>
      </div>
    </div>
  </div>
</template>
```

### 4.7 Unread Badge Component

Untuk menampilkan badge unread di navigasi (`components/ChatBadge.vue`):

```vue
<script setup lang="ts">
const { adminApi } = useChat()
const { $echo } = useNuxtApp()
const user = useAuthUser()

const unreadCount = ref(0)

async function fetchUnread() {
  const res = await adminApi.getUnreadCount()
  unreadCount.value = res.data.unread_count
}

onMounted(() => {
  fetchUnread()

  // Polling setiap 30 detik
  const interval = setInterval(fetchUnread, 30000)

  // Real-time update via WebSocket
  if ($echo && user.value?.brand?.id) {
    $echo
      .private(`chat.brand.${user.value.brand.id}`)
      .listen('ConversationUpdated', () => {
        fetchUnread()
      })
  }

  onUnmounted(() => clearInterval(interval))
})
</script>

<template>
  <NuxtLink to="/cms/chat" class="nav-link">
    Chat
    <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
  </NuxtLink>
</template>
```

---

## Error Responses

Semua error mengikuti format standar:

| Code | Keterangan |
|------|------------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (token invalid) |
| 403 | Forbidden (bukan anggota / bukan pemilik conversation) |
| 404 | Conversation tidak ditemukan |
| 422 | Validation Error (field tidak valid) |

**Format Error (400/401/403):**
```json
{
  "code": 403,
  "message": "Unauthorized"
}
```

**Format Validation Error (422):**
```json
{
  "message": "The body field is required when image is not present.",
  "errors": {
    "body": ["The body field is required when image is not present."],
    "image": ["The image field is required when body is not present."]
  }
}
```
