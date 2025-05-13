<template>
  <div class="sidebar-container">
    <!-- Fondo oscuro para hacer toggle -->
    <div 
      v-if="isVisible" 
      class="sidebar-backdrop" 
      @click="closeSidebar"
    ></div>
    
    <!-- Sidebar -->
    <transition name="slide">
      <aside 
        v-if="isVisible" 
        class="sidebar"
      >
        <button class="close-btn" @click="closeSidebar">
          &times;
        </button>
        
        <slot></slot>
      </aside>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isVisible: this.visible
    }
  },
  watch: {
    visible(newVal) {
      this.isVisible = newVal
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  methods: {
    closeSidebar() {
      this.$emit('close')
    }
  },
  beforeUnmount() {
    document.body.style.overflow = 'auto'
  }
}
</script>

<style scoped>
.sidebar-container {
  position: relative;
}

.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Animación para el sidebar */
.slide-enter-active{
  transition: transform 0.4s ease;
}

.slide-leave-active {
  transition: transform 0.4s ease;
}

.slide-enter, .slide-leave-to {
  transform: translateX(-100%);
}
</style>