<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const userData = ref(null)
const currentStory = ref(0)
const isLoading = ref(true)
const error = ref(null)

const stories = computed(() => {
  if (!userData.value) return []

  return [
    {
      title: '2024 Siege Wrapped',
      subtitle: 'Your journey at Siege',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: userData.value.username || 'User',
      subtitle: `You have been with us since ${new Date(userData.value.created_at).getFullYear()}`,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: `${userData.value.total_hours || 0}h`,
      subtitle: 'Total Sessions',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: `Level ${userData.value.level || 1}`,
      subtitle: 'Your current level',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      title: 'Thank you!',
      subtitle: 'See you in another YSWS 🎉',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ]
})

const nextStory = () => {
  if (currentStory.value < stories.value.length - 1) {
    currentStory.value++
  }
}

const prevStory = () => {
  if (currentStory.value > 0) {
    currentStory.value--
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') nextStory()
  if (e.key === 'ArrowLeft') prevStory()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  fetch("http://localhost:3031/api/siege/user/U0877PG14F4", {
    "method": "GET",
    "headers": {
      "accept": "application/json",
    }
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
    .then(data => {
      userData.value = data;
      isLoading.value = false;
    })
    .catch(err => {
      console.error("Error fetching user data:", err)
      error.value = err.message
      isLoading.value = false
    })
})
</script>

<template>
  <div class="wrapped-container">
    <div v-if="isLoading" class="story-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
      <div class="story-content">
        <div class="loading-spinner"></div>
        <h1 class="story-title">Loading your Stats...</h1>
      </div>
    </div>
    <div v-else-if="error" class="story-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
      <div class="story-content">
        <h1 class="story-title">Oops!</h1>
        <p class="story-subtitle">{{ error }}</p>
      </div>
    </div>
    <div v-else class="stories-wrapper">
      <div class="progress-bars">
        <div v-for="(story, index) in stories" :key="index" class="progress-bar"
          :class="{ active: index === currentStory, completed: index < currentStory }">
          <div class="progress-fill"></div>
        </div>
      </div>
      <div class="story-card" :style="{ background: stories[currentStory]?.gradient }">
        <div class="story-content">
          <h1 class="story-title" :key="currentStory">{{ stories[currentStory]?.title }}</h1>
          <p class="story-subtitle" :key="currentStory + '-sub'">{{ stories[currentStory]?.subtitle }}</p>
        </div>
        <div class="nav-area nav-left" @click="prevStory"></div>
        <div class="nav-area nav-right" @click="nextStory"></div>
      </div>
      <div class="story-counter">
        {{ currentStory + 1 }} / {{ stories.length }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapped-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  overflow: hidden;
  font-family: 'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.stories-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 900px;
}

.progress-bars {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.progress-bar {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar.active .progress-fill {
  width: 100%;
  height: 100%;
  background: white;
  animation: progress 5s linear;
}

.progress-bar.completed .progress-fill {
  width: 100%;
  height: 100%;
  background: white;
}

@keyframes progress {
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
}

.story-card {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.story-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  padding: 40px;
  width: 100%;
}

.story-title {
  font-size: 4rem;
  font-weight: 900;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
  animation: slideUp 0.6s ease-out;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.story-subtitle {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 20px 0 0;
  opacity: 0.95;
  animation: slideUp 0.6s ease-out 0.1s backwards;
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

.nav-area {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  cursor: pointer;
  z-index: 5;
  transition: background 0.2s;
}

.nav-area:active {
  background: rgba(0, 0, 0, 0.1);
}

.nav-left {
  left: 0;
}

.nav-right {
  right: 0;
}

.story-counter {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.7;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 30px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .stories-wrapper {
    max-width: 100%;
    max-height: 100%;
  }

  .story-card {
    border-radius: 0;
  }

  .story-title {
    font-size: 3rem;
  }

  .story-subtitle {
    font-size: 1.4rem;
  }
}
</style>
