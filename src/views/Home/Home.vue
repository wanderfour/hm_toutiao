<template>
  <div class="home-container">
    <!-- Navbar -->
    <van-nav-bar fixed>
      <template #left>
        <!-- 在 .vue 文件中通过相对路径引用本地图片时，需要在图片的链接外包上一层 require()，将图片 URL 转换为 webpack 模块请求，并结合 file-loader 或者 url-loader 进行处理。 -->
        <van-image
          height="36px"
          alt="logo"
          :src="require('../../assets/toutiao_logo.png')"
          class="logo"
        />
      </template>
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <h1>Home</h1>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 46px 0 50px 0;
}
</style>
