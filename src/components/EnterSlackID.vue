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
</script>

<template>
  <div class="start-screen">
    <div class="container">
      <div class="logo-section">
        <h1 class="logo"><!--⚔️ -->SIEGE WRAPPED</h1>
      </div>
      <div class="content-section">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Enter your Slack ID to see your year in review</legend>
          <div class="underline-field">
            <input v-model="slackId" placeholder="e.g., U0788PG14F5" required="true" class="text-input validator"
              :disabled="isLoading" type="text">
          </div>
        </fieldset>
        <a class="submit-button" @click="validateAndSubmit" :disabled="isLoading">{{ isLoading ? 'Loading...' : `Get
          your Wrapped` }}</a>
        <div v-if="error" class="error-message">
          Error: {{ error }}
        </div>
        <div class="info-section">
          <p class="info-text">You can get your Slack ID in #what-is-my-slack-id</p>
          <!--<p class="info-text">Your Slack ID starts with "U" followed by numbers and letters</p>-->
        </div>
      </div>
      <div class="footer">
        <h3>Important: This is not a official Siege site!</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "IM Fell English", serif;
  font-size: 1.125rem;
  padding: 0.75rem 1.25rem;
  position: relative;
  border: 3px solid rgba(64, 43, 32, 0.75);
  color: rgb(59, 42, 26);
  background: transparent;
  cursor: pointer;
  text-decoration: none;
}

.submit-button::after {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: inherit;
  border: 3px solid rgba(64, 43, 32, 0.55);
  pointer-events: none;
  transition: inset 0.2s ease-in-out;
}

.start-screen {
  width: 100vw;
  height: 100vh;
  background: #f5f5f4 url('https://siege.hackclub.com/assets/parchment-texture-e4dc566e.jpg') repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.container {
  width: 100%;
  max-width: 550px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 60px;
  text-align: center;
  color: rgba(64, 43, 32, 0.75);
  ;
}

.logo-section {
  animation: slideDown 0.6s ease-out;
}

.logo {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;
  /*text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); */
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

.underline-field::after {
  bottom: 15%;
  height: clamp(28px, 3vw, 52px);
}

.underline-field::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 25%;
  height: clamp(18px, 2.8vw, 36px);
  background-image: url("https://siege.hackclub.com/assets/underline-long-ce0d7881.webp");
  background-repeat: no-repeat;
  background-position: left bottom;
  background-size: 100% 100%;
  pointer-events: none;
  z-index: 0;
}

.underline-field {
  margin-bottom: .8rem;
}

.underline-field {
  position: relative;
  display: block;
  padding-bottom: clamp(22px, 3.2vw, 44px);
  margin-bottom: 0.5rem;
  overflow: visible;
}

.fieldset {
  border: 0;
  margin: 0;
  padding: 0;
  overflow: visible;
}

fieldset {
  display: block;
  min-inline-size: min-content;
  margin-inline: 2px;
  border-width: 2px;
  border-style: groove;
  border-color: threedface;
  border-image: initial;
  padding-block: 0.35em 0.625em;
  padding-inline: 0.75em;
}

.fieldset-legend {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  color: #3b2a1a;
  width: 100%;
}

.fieldset-legend {
  font-size: 1rem;
  margin-bottom: 0.375rem;
}

legend {
  display: block;
  unicode-bidi: isolate;
  padding-inline: 2px;
}

.text-input,
.textarea-input,
.select-input {
  width: 100%;
  font-size: 1.125rem;
  padding: 0.5rem 0.125rem;
  border: none;
  border-radius: 0;
  background-color: transparent;
  position: relative;
  z-index: 1;
  appearance: none;
  -webkit-appearance: none;
}
</style>