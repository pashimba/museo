<template>
  <div>
    <h1>Linea de tiempo</h1>
    <TimeLine :items="timelineItems" />
  </div>
</template>

<script>
import TimeLine from '../components/TimeLine';

export default {
  components: {
    TimeLine
  },
  data() {
    return {
      timelineItems: [
        {
          title: 'Fundación',
          date: 'Enero 2010',
          description: 'Nuestra empresa fue fundada con la visión de revolucionar el mercado.'
        },
        {
          title: 'Primer Producto',
          date: 'Junio 2012',
          description: 'Lanzamiento de nuestro primer producto al mercado con gran aceptación.'
        },
        {
          title: 'Expansión Internacional',
          date: 'Marzo 2015',
          description: 'Apertura de nuestras primeras oficinas en el extranjero.'
        },
        {
          title: 'Reconocimiento',
          date: 'Noviembre 2018',
          description: 'Premio a la innovación tecnológica en nuestra industria.'
        },
        {
          title: 'Actualidad',
          date: '2023',
          description: 'Continuamos innovando y creciendo con un equipo de más de 500 personas.'
        }
      ]
    }
  }
}
</script>