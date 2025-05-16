<template>
    <div class="timeline-container">
        <div class="timeline-wrapper" ref="timelineWrapper">
            <div class="timeline" :style="{ width: timelineWidth + 'px' }">
                <div v-for="(item, index) in items" :key="index" class="timeline-item"
                    :style="{ left: (index * itemWidth) + 'px' }" @click="setActive(index)"
                    :class="{ 'active': activeIndex === index }">
                    <div class="timeline-dot" @click="setActive(index)" :class="{ 'active': activeIndex === index }"></div>
                    <div class="timeline-content">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.date }}</p>
                        <div class="timeline-details" v-if="activeIndex === index">
                            {{ item.description }}
                        </div>
                    </div>
                </div>
                <div class="timeline-line"></div>
            </div>
        </div>

        <div class="timeline-controls">
            <button @click="scrollTimeline(-1)" :disabled="scrollPosition <= 0">
                &lt;
            </button>
            <button @click="scrollTimeline(1)" :disabled="scrollPosition >= maxScroll">
                &gt;
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TimeLine',
    props: {
        items: {
            type: Array,
            required: true,
            default: () => [
                {
                    title: 'Evento 1',
                    date: 'Enero 2023',
                    description: 'Descripción detallada del primer evento importante.'
                },
                {
                    title: 'Evento 2',
                    date: 'Marzo 2023',
                    description: 'Detalles sobre el segundo hito en nuestra línea de tiempo.'
                },
                // Puedes agregar más eventos aquí
            ]
        }
    },
    data() {
        return {
            activeIndex: 0,
            itemWidth: 250,
            scrollPosition: 0,
            timelineWrapperWidth: 0
        }
    },
    computed: {
        timelineWidth() {
            return this.items.length * this.itemWidth;
        },
        maxScroll() {
            return this.timelineWidth - this.timelineWrapperWidth;
        }
    },
    mounted() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    },
    methods: {
        setActive(index) {
            this.activeIndex = index;
            this.centerItem(index);
        },
        scrollTimeline(direction) {
            const newPosition = this.scrollPosition + (direction * this.itemWidth);
            this.scrollPosition = Math.max(0, Math.min(newPosition, this.maxScroll));
            this.$refs.timelineWrapper.scrollLeft = this.scrollPosition;
        },
        centerItem(index) {
            const position = (index * this.itemWidth) - (this.timelineWrapperWidth / 2) + (this.itemWidth / 2);
            this.scrollPosition = Math.max(0, Math.min(position, this.maxScroll));
            this.$refs.timelineWrapper.scrollLeft = this.scrollPosition;
        },
        updateDimensions() {
            if (this.$refs.timelineWrapper) {
                this.timelineWrapperWidth = this.$refs.timelineWrapper.offsetWidth;
            }
        }
    }
}
</script>

<style scoped>
.timeline-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.timeline-wrapper {
    width: 100%;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 40px 0;
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.timeline-wrapper::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.timeline {
    position: relative;
    height: 200px;
    display: inline-block;
    white-space: nowrap;
}

.timeline-line {
    position: absolute;
    left: 0;
    top: 50px;
    height: 4px;
    width: 100%;
    background-color: #3498db;
    z-index: 1;
}

.timeline-item {
    position: absolute;
    display: inline-block;
    width: 200px;
    white-space: normal;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 2;
}

.timeline-item.active {
    transform: scale(1.05);
}

.timeline-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #2980b9;
    border: 4px solid #3498db;
    margin: 0 auto;
    position: relative;
    z-index: 3;
}

.timeline-dot.active {
    width: 25px;
    height: 25px;
    background-color: #309fe9;
    border: 4px solid #6ac3ff;
}

.timeline-content {
    text-align: center;
    padding: 10px;
    margin-top: 10px;
    background-color: #f8f9fa;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.timeline-content h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.1rem;
}

.timeline-content p {
    margin: 5px 0;
    color: #7f8c8d;
    font-size: 0.9rem;
}

.timeline-details {
    margin-top: 10px;
    padding: 10px;
    background-color: #e8f4fc;
    border-radius: 5px;
    font-size: 0.9rem;
    color: #34495e;
    white-space: normal;
}

.timeline-controls {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 20px;
}

.timeline-controls button {
    padding: 8px 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.timeline-controls button:hover:not(:disabled) {
    background-color: #2980b9;
}

.timeline-controls button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}
</style>