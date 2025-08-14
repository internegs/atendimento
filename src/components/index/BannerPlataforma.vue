<script>
export default {
  name: "BannerPlaforma",
  props: {
    data: Array,
  }
};
</script>


<style scoped>

.titulo-plataforma{
  word-break:break-all;
}
.btn-pad {
  padding: 15px 20px;
}
.hover:hover{
  background-color: #ce5600;
}
.plaforma {
  background-color: #f2f2f2;
}
.f-36 {
  font-size: 36px;
}
.img-plaforma {
  width: 400px;
}
.mr-60 {
  margin-right: 60px;
}
.btn-div button {
  padding: 10px 20px;
}

@media (max-width: 1050px) {
  .img-plaforma {
    width: 300px
  }
}
@media (max-width: 900px) {
  .img-plaforma {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .btn-div a {
    width: 100%;
  }

}

.bg-color {
  background-image: linear-gradient(to right, #00308f, #0774ae);
}
</style>