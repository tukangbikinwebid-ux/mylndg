<template>
  <section
    class="relative min-h-screen bg-[#0A052E] overflow-hidden flex flex-col"
    :style="backgroundStyle"
  >
    <div class="absolute top-[-5%] left-[-10%] w-72 h-72 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[10%] right-[-5%] w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full"></div>

    <div class="relative z-10 flex flex-col h-screen">
      <!-- Header -->
      <CardsNavigasiHeader :title="t('chat.title')" type="menu" class="bg-[#0A052E]/60 backdrop-blur-xl border-b border-white/5" />

      <!-- Loading State -->
      <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center">
        <div class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p class="text-slate-400 animate-pulse text-sm">{{ t('chat.loading') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="flex-1 flex items-center justify-center px-5">
        <div class="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl text-red-400 text-center animate-enter w-full max-w-md">
          <i class="fa-solid fa-circle-exclamation mb-2 block text-2xl"></i>
          <p class="text-sm mb-4">{{ errorMessage }}</p>
          <button
            @click="initChat"
            class="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/15 transition-colors"
          >
            <i class="fa-solid fa-rotate-right"></i>
            Cuba Semula
          </button>
        </div>
      </div>

      <!-- Chat Area -->
      <template v-else>
        <!-- Messages -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto px-4 pt-24 pb-4 space-y-3 scroll-smooth">
          <!-- Load more button -->
          <div v-if="hasMorePages" class="flex justify-center mb-4">
            <button
              @click="loadMoreMessages"
              :disabled="loadingMore"
              class="text-xs text-blue-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all disabled:opacity-50"
            >
              <span v-if="loadingMore">
                <i class="fa-solid fa-spinner fa-spin mr-1"></i>
              </span>
              <span v-else>Muat lagi mesej sebelumnya</span>
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full opacity-40">
            <div class="w-20 h-20 mb-6 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <i class="fa-solid fa-comments text-4xl text-slate-500"></i>
            </div>
            <p class="text-slate-400 font-medium tracking-wide text-center">{{ t('chat.empty') }}</p>
          </div>

          <!-- Message bubbles -->
          <template v-for="(msg, index) in messages" :key="msg.id">
            <!-- Date separator -->
            <div
              v-if="shouldShowDateSeparator(index)"
              class="flex items-center justify-center my-4"
            >
              <div class="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {{ formatDateSeparator(msg.created_at) }}
                </span>
              </div>
            </div>

            <!-- Message bubble -->
            <div
              :class="[
                'flex',
                msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'
              ]"
            >
              <!-- Admin avatar -->
              <div
                v-if="msg.sender_type === 'admin'"
                class="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mr-2 mt-auto mb-1 flex-shrink-0"
              >
                <i class="fa-solid fa-headset text-blue-400 text-xs"></i>
              </div>

              <div
                :class="[
                  'max-w-[75%] rounded-[1.5rem] px-4 py-3 shadow-lg',
                  msg.sender_type === 'customer'
                    ? 'bg-blue-600/30 border border-blue-500/20 rounded-br-lg'
                    : 'bg-white/[0.06] border border-white/10 rounded-bl-lg'
                ]"
              >
                <!-- Sender name for admin -->
                <p v-if="msg.sender_type === 'admin' && msg.sender" class="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">
                  {{ msg.sender.name }}
                </p>

                <!-- Image attachments -->
                <div v-if="msg.attachments && msg.attachments.length > 0" class="mb-2">
                  <img
                    v-for="url in msg.attachments"
                    :key="url"
                    :src="url"
                    class="rounded-2xl max-w-full max-h-48 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    @click="openImage(url)"
                    loading="lazy"
                  />
                </div>

                <!-- Text body -->
                <p v-if="msg.body" class="text-sm text-white/90 leading-relaxed break-words whitespace-pre-wrap">{{ msg.body }}</p>

                <!-- Time -->
                <div class="flex items-center gap-1 mt-1.5" :class="msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'">
                  <span class="text-[10px] text-slate-500">
                    {{ formatTime(msg.created_at) }}
                  </span>
                  <span v-if="msg.sender_type === 'customer' && msg.read_at" class="text-blue-400 text-[10px]">
                    <i class="fa-solid fa-check-double"></i>
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Conversation closed notice -->
        <div v-if="conversation && conversation.status === 'closed'" class="px-4 pb-28">
          <div class="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <i class="fa-solid fa-lock text-slate-500 mb-2 block"></i>
            <p class="text-sm text-slate-400">{{ t('chat.closed') }}</p>
          </div>
        </div>

        <!-- Image preview -->
        <div v-if="imagePreview" class="px-4 pb-2">
          <div class="relative inline-block bg-white/5 border border-white/10 rounded-2xl p-2">
            <img :src="imagePreview" class="h-20 rounded-xl object-cover" />
            <button
              @click="removeImage"
              class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg hover:bg-red-600 transition-colors"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Input area -->
        <div v-if="!conversation || conversation.status === 'open'" class="px-4 pb-28 pt-2">
          <div class="flex items-end gap-2 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-2 shadow-[0_-5px_30px_rgba(0,0,0,0.3)]">
            <!-- Attach button -->
            <label class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 cursor-pointer transition-colors flex-shrink-0">
              <input type="file" accept="image/jpeg,image/png,image/jpg,image/gif,image/heif,image/heic" hidden @change="onFileSelect" />
              <i class="fa-solid fa-paperclip text-slate-400"></i>
            </label>

            <!-- Text input -->
            <textarea
              v-model="messageBody"
              :placeholder="t('chat.placeholder')"
              rows="1"
              class="flex-1 bg-transparent text-white text-sm placeholder-slate-500 resize-none outline-none py-2.5 px-1 max-h-24 overflow-y-auto"
              @keydown.enter.exact.prevent="sendMessage"
              @input="autoResize"
              ref="textareaRef"
            ></textarea>

            <!-- Send button -->
            <button
              @click="sendMessage"
              :disabled="isSending || (!messageBody.trim() && !imageFile)"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              <i v-if="isSending" class="fa-solid fa-spinner fa-spin text-white text-sm"></i>
              <i v-else class="fa-solid fa-paper-plane text-white text-sm"></i>
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Image lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxImage"
        class="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
        @click="lightboxImage = null"
      >
        <button class="absolute top-6 right-6 text-white/70 hover:text-white text-2xl">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <img :src="lightboxImage" class="max-w-full max-h-full object-contain rounded-lg" />
      </div>
    </Teleport>

    <CardsNavigasiFooter title="chat" type="menu" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue";
import { getCookie, getSetting } from "@/composables/utils";
import { useChat } from "@/composables/useChat";

const { t } = useI18n();
const { createConversation, getMessages, sendTextMessage, sendImageMessage } = useChat();

const conversation = ref<any>(null);
const messages = ref<any[]>([]);
const messageBody = ref("");
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const chatContainer = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const lightboxImage = ref<string | null>(null);

const isLoading = ref(false);
const isSending = ref(false);
const loadingMore = ref(false);
const errorMessage = ref("");
const currentPage = ref(1);
const lastPage = ref(1);

const hasMorePages = computed(() => currentPage.value < lastPage.value);

// Initialize chat
async function initChat() {
  isLoading.value = true;
  errorMessage.value = "";

  const token = getCookie("token");
  if (!token) {
    errorMessage.value = t("chat.session-expired");
    isLoading.value = false;
    return;
  }

  try {
    const settings = await getSetting();
    if (settings.maintenance == 1) {
      window.location.href = "/maintenance";
      return;
    }

    const res = await createConversation();
    conversation.value = res.data;
    await loadMessages();
  } catch (error: any) {
    console.error(error);
    if (error.message?.includes("401")) {
      window.location.href = "/sign-in";
      return;
    }
    errorMessage.value = t("chat.error");
  } finally {
    isLoading.value = false;
  }
}

// Load messages
async function loadMessages() {
  if (!conversation.value) return;

  try {
    const res = await getMessages(conversation.value.id, 1, 50);
    messages.value = res.data.data.reverse();
    currentPage.value = res.data.current_page;
    lastPage.value = res.data.last_page;
    scrollToBottom();
  } catch (error) {
    console.error(error);
  }
}

// Load more (older) messages
async function loadMoreMessages() {
  if (!conversation.value || loadingMore.value || !hasMorePages.value) return;

  loadingMore.value = true;
  try {
    const nextPage = currentPage.value + 1;
    const res = await getMessages(conversation.value.id, nextPage, 50);
    const olderMessages = res.data.data.reverse();
    messages.value = [...olderMessages, ...messages.value];
    currentPage.value = res.data.current_page;
    lastPage.value = res.data.last_page;
  } catch (error) {
    console.error(error);
  } finally {
    loadingMore.value = false;
  }
}

// Send message
async function sendMessage() {
  if (!conversation.value) return;
  if (!messageBody.value.trim() && !imageFile.value) return;

  isSending.value = true;
  try {
    let res;
    if (imageFile.value) {
      res = await sendImageMessage(
        conversation.value.id,
        imageFile.value,
        messageBody.value.trim() || undefined
      );
    } else {
      res = await sendTextMessage(conversation.value.id, messageBody.value.trim());
    }

    // Add new message to the list
    messages.value.push(res.data);
    messageBody.value = "";
    removeImage();
    resetTextarea();
    scrollToBottom();
  } catch (error: any) {
    console.error(error);
    alert(t("chat.send-failed"));
  } finally {
    isSending.value = false;
  }
}

// File handling
function onFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
  // Reset input to allow selecting same file
  (event.target as HTMLInputElement).value = "";
}

function removeImage() {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imageFile.value = null;
  imagePreview.value = null;
}

// Image lightbox
function openImage(url: string) {
  lightboxImage.value = url;
}

// Scroll to bottom
function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

// Auto-resize textarea
function autoResize() {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 96) + "px";
  }
}

function resetTextarea() {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
  }
}

// Date formatting
function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return t("chat.today");
  if (date.toDateString() === yesterday.toDateString()) return t("chat.yesterday");

  return date.toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shouldShowDateSeparator(index: number): boolean {
  if (index === 0) return true;
  const current = new Date(messages.value[index].created_at).toDateString();
  const previous = new Date(messages.value[index - 1].created_at).toDateString();
  return current !== previous;
}

// Polling for new messages (every 10 seconds)
let pollInterval: ReturnType<typeof setInterval> | null = null;

async function pollMessages() {
  if (!conversation.value) return;
  try {
    const res = await getMessages(conversation.value.id, 1, 50);
    const newMessages = res.data.data.reverse();
    if (newMessages.length > messages.value.length) {
      const existingIds = new Set(messages.value.map((m: any) => m.id));
      const incoming = newMessages.filter((m: any) => !existingIds.has(m.id));
      if (incoming.length > 0) {
        messages.value.push(...incoming);
        scrollToBottom();
      }
    }
  } catch (error) {
    // Silent fail for polling
  }
}

onMounted(() => {
  initChat();
  pollInterval = setInterval(pollMessages, 10000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
  removeImage();
});

const backgroundStyle = computed(() => ({
  backgroundColor: "#0A052E",
  backgroundImage: "radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)",
}));
</script>

<style scoped>
.animate-enter {
  animation: slideUpFade 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

::-webkit-scrollbar {
  display: none;
}

textarea::-webkit-scrollbar {
  display: none;
}
</style>
