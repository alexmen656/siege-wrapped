<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import EnterSlackID from './components/EnterSlackID.vue'

interface Project {
  name: string
  coin_value: string
  description?: string
  demo_url?: string
  repo_url?: string
  hours?: number
  created_at?: string
  week_badge_text?: string
}

interface UserData {
  username: string
  created_at: string
  total_hours: number
  level: number
  projects?: Project[]
}

const userData = ref<UserData | null>(null)
const currentStory = ref(0)
const isLoading = ref(true)
const error = ref(null)
const slackId = ref<string | null>(null)
const hasStarted = ref(false)
const countdownTime = ref('00:00:00')
let countdownInterval: ReturnType<typeof setInterval> | null = null

interface StorySlide {
  title: string
  subtitle: string
  gradient: string
  type: string
  detail?: string
  projectData?: Project
}

const stories = computed<StorySlide[]>(() => {
  if (!userData.value) return []

  const sortedProjects = (userData.value?.projects || [])
    .sort((a, b) => parseFloat(b.coin_value) - parseFloat(a.coin_value))

  const topProjects = sortedProjects.slice(0, 3)
  const totalProjects = userData.value.projects?.length || 0
  const totalCoins = sortedProjects.reduce((sum, p) => sum + parseFloat(p.coin_value), 0)
  const avgHoursPerProject = userData.value.total_hours / Math.max(totalProjects, 1)
  const yearsSince = new Date().getFullYear() - new Date(userData.value.created_at).getFullYear()

  const slides: StorySlide[] = [
    {
      title: '🎊 Siege Wrapped 2025',
      subtitle: `Your journey at Siege`,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      type: 'intro'
    },
    {
      title: `⏰ ${countdownTime.value}`,
      subtitle: 'Until Siege ends',
      detail: 'Make every moment count!',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      type: 'countdown'
    },
    {
      title: userData.value.username || 'Maker',
      subtitle: yearsSince > 0
        ? `Member since ${new Date(userData.value.created_at).getFullYear()} • ${yearsSince} year${yearsSince > 1 ? 's' : ''} of building`
        : `Joined ${new Date(userData.value.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      type: 'user'
    },
    {
      title: '📊 Your Stats',
      subtitle: `${totalProjects} project${totalProjects !== 1 ? 's' : ''} • ${Math.round(userData.value.total_hours)}h total • Level ${userData.value.level}`,
      detail: `${Math.round(totalCoins)} coins earned`,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      type: 'stats'
    },
    {
      title: `${Math.round(userData.value.total_hours)}h`,
      subtitle: 'Time spent building',
      detail: `That's ${Math.round(avgHoursPerProject)}h per project on average`,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      type: 'hours'
    },
    {
      title: `🎖️ Level ${userData.value.level}`,
      subtitle: 'Your current level',
      detail: 'Keep building to level up!',
      gradient: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 50%, #2BFF88 100%)',
      type: 'level'
    },
    {
      title: '🏆 Your Top Projects',
      subtitle: topProjects.length > 0
        ? `You've built ${totalProjects} project${totalProjects !== 1 ? 's' : ''}, here are your best`
        : 'Start building to see your projects here',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      type: 'projects-intro'
    }
  ]

  topProjects.forEach((project, index) => {
    const medals = ['🥇', '🥈', '🥉']
    slides.push({
      title: `${medals[index]} ${project.name}`,
      subtitle: project.description || 'An amazing project',
      detail: `${project.coin_value} coins${project.hours ? ` • ${project.hours}h` : ''}`,
      gradient: index === 0
        ? 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
        : index === 1
          ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
          : 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      type: 'project',
      projectData: project
    })
  })

  slides.push(
    {
      title: `💰 ${Math.round(totalCoins)} Coins`,
      subtitle: 'Total earned this semester',
      detail: 'Your hard work is paying off!',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      type: 'coins'
    },
    {
      title: '🎉 Thank You!',
      subtitle: 'Keep building amazing things',
      detail: 'See you in the next YSWS',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      type: 'outro'
    }
  )

  return slides
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

const startCountdown = () => {
  const endTime = new Date('2025-12-08T00:00:00-05:00');

  const updateCountdown = () => {
    const now = new Date()
    const timeRemaining = endTime.getTime() - now.getTime()

    if (timeRemaining <= 0) {
      countdownTime.value = '00:00:00'
      if (countdownInterval) clearInterval(countdownInterval)
      return
    }

    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60)
    const seconds = Math.floor((timeRemaining / 1000) % 60)

    countdownTime.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
}

const handleSlackIdSubmit = (id: string) => {
  slackId.value = id
  hasStarted.value = true
  isLoading.value = true
  error.value = null
  fetchUserData(id)
}

const fetchUserData = (id: string) => {
  startCountdown()
  fetch(`http://localhost:3031/api/siege/user/${id}`, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      return res.json()
    })
    .then(data => {
      userData.value = data
      isLoading.value = false
    })
    .catch(err => {
      console.error('Error fetching user data:', err)
      error.value = err.message
      isLoading.value = false
    })
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<template>
  <div class="wrapped-container">
    <EnterSlackID v-if="!hasStarted" @submit="handleSlackIdSubmit" />
    <div v-else-if="isLoading" class="story-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
      <div class="story-content">
        <div class="loading-spinner"></div>
        <h1 class="story-title">Loading your Stats...</h1>
      </div>
    </div>
    <div v-else-if="error" class="story-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
      <div class="story-content">
        <h1 class="story-title">Oops!</h1>
        <p class="story-subtitle">{{ error }}</p>
        <button @click="hasStarted = false" class="back-btn">Try Again</button>
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
        <div class="story-content" :class="'slide-type-' + stories[currentStory]?.type">
          <h1 class="story-title" :key="currentStory">{{ stories[currentStory]?.title }}</h1>
          <p class="story-subtitle" :key="currentStory + '-sub'" v-html="stories[currentStory]?.subtitle"></p>
          <p v-if="stories[currentStory]?.detail" class="story-detail" :key="currentStory + '-detail'">
            {{ stories[currentStory]?.detail }}
          </p>
          <div v-if="stories[currentStory]?.projectData?.demo_url" class="project-links">
            <a :href="stories[currentStory]?.projectData?.demo_url" target="_blank" class="project-link">
              🔗 View Demo
            </a>
            <a v-if="stories[currentStory]?.projectData?.repo_url" :href="stories[currentStory]?.projectData?.repo_url"
              target="_blank" class="project-link">
              💻 Repository
            </a>
          </div>
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

.story-detail {
  font-size: 1.3rem;
  font-weight: 500;
  margin: 15px 0 0;
  opacity: 0.85;
  animation: slideUp 0.6s ease-out 0.2s backwards;
}

.project-links {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
  animation: slideUp 0.6s ease-out 0.3s backwards;
  flex-wrap: wrap;
}

.project-link {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid white;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.project-link:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.slide-type-intro .story-title {
  font-size: 4.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.slide-type-countdown .story-title {
  font-size: 5rem;
  font-family: 'Courier New', monospace;
  font-weight: 700;
}

.slide-type-project .story-subtitle {
  font-size: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

.slide-type-stats .story-title,
.slide-type-hours .story-title,
.slide-type-coins .story-title,
.slide-type-level .story-title {
  font-size: 5.5rem;
}

.slide-type-outro .story-title {
  font-size: 4.5rem;
}

.back-btn {
  margin-top: 30px;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid white;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: white;
  color: #f093fb;
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
    font-size: 2.5rem;
  }

  .story-subtitle {
    font-size: 1.2rem;
  }

  .story-detail {
    font-size: 1rem;
  }

  .slide-type-intro .story-title,
  .slide-type-countdown .story-title,
  .slide-type-stats .story-title,
  .slide-type-hours .story-title,
  .slide-type-coins .story-title,
  .slide-type-level .story-title,
  .slide-type-outro .story-title {
    font-size: 3rem;
  }

  .project-links {
    flex-direction: column;
    padding: 0 20px;
  }

  .project-link {
    width: 100%;
    max-width: 250px;
  }

  .story-content {
    padding: 20px;
  }
}
</style>
