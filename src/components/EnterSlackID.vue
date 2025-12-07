<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  submit: [slackId: string]
}>()

const slackId = ref('')
const error = ref('')
const isLoading = ref(false)

const validateAndSubmit = async () => {
  error.value = ''

  if (!slackId.value.trim()) {
    error.value = 'Please enter your Slack ID (You can get yours in #what-is-my-slack-id)'
    return
  }

  if (!slackId.value.match(/^U[A-Z0-9]{8,}$/)) {
    error.value = 'Invalid Slack ID format. Example: U0788PG14F5'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(`http://localhost:3031/api/siege/user/${slackId.value}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        error.value = 'Slack user not found. Please check your ID.'
      } else {
        error.value = `Error: ${response.status} - Unable to fetch user data`
      }
      return
    }

    emit('submit', slackId.value)
  } catch (err) {
    error.value = 'Connection error. Make sure the server is running.'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    validateAndSubmit()
  }
}
</script>

<template>
  <div class="start-screen">
    <div class="container">
      <div class="logo-section">
        <h1 class="logo">⚔️ SIEGE WRAPPED</h1>
      </div>
      <div class="content-section">
        <h2 class="title">Your 2025 Siege Stats Await</h2>
        <p class="subtitle">Enter your Slack ID to see your year in review</p>
        <div class="input-wrapper">
          <input v-model="slackId" type="text" placeholder="e.g., U0788PG14F5" class="slack-input" :disabled="isLoading"
            @keydown="handleKeydown" />
          <button @click="validateAndSubmit" :disabled="isLoading" class="submit-btn">
            {{ isLoading ? 'Loading...' : 'View My Stats' }}
          </button>
        </div>
        <div v-if="error" class="error-message">
          Error: {{ error }}
        </div>
        <div class="info-section">
          <p class="info-text">Your Slack ID starts with "U" followed by numbers and letters</p>
        </div>
      </div>
      <div class="footer">
        <p>Made with ❤️ for Siege</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.start-screen {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow: hidden;
}

.container {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 60px;
  text-align: center;
  color: white;
}

.logo-section {
  animation: slideDown 0.6s ease-out;
}

.logo {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: slideUp 0.6s ease-out 0.1s backwards;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

.subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.95;
  font-weight: 500;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slack-input {
  padding: 16px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  transition: all 0.3s;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.slack-input:focus {
  outline: none;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.slack-input::placeholder {
  color: #999;
}

.slack-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn {
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid white;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.submit-btn:hover:not(:disabled) {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  padding: 12px 16px;
  background: rgba(255, 107, 107, 0.9);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  animation: shake 0.4s ease-out;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-8px);
  }

  75% {
    transform: translateX(8px);
  }
}

.info-section {
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.info-text {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 500;
}

.footer {
  opacity: 0.8;
  font-size: 0.9rem;
}

.footer p {
  margin: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 30px 20px;
    gap: 40px;
  }

  .logo {
    font-size: 2.5rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>
