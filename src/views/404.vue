<template>
  <div class="http404_con">
    <div class="http404">
      <p class="p1">:(</p>
      <p class="p2">你访问的页面不存在，请检查网页链接是否填写正确。</p>
      <p class="p3">我们只收集某些错误信息，然后你可以重新<a href="/">返回首页</a>。</p>
      <p class="p4"><span class="ds">0%</span> 完成</p>
      <div class="p5">
        <img style="width: 150px;height: 150px;margin-right: 20px;" src="../assets/404_images/404.png" alt="QRCODE">
        <div style="margin-top: -3px;">
          <p>有关此问题的详细信息是：</p>
          <ul style="margin-top: 5px;font-size: 14px;margin-bottom: 5px;">
            <ol>1. 该页面已被管理员删除；</ol>
            <ol>2. 该页面已被管理员移动到其他位置；</ol>
            <ol>3. 该页面链接填写错误。</ol>
          </ul>
          <p>终止代码：PAGE_NOT_FOUND</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '404',
  mounted() {
    let ds = document.querySelector('.ds')
    let i = 0
    let timer = setInterval(() => {
      i += 1
      ds.innerHTML = i + '%'
      if (i === 60) {
        clearInterval(timer)
        timer = setInterval(() => {
          i += 1
          ds.innerHTML = i + '%'
          if (i === 80) {
            clearInterval(timer)
            timer = setInterval(() => {
              i += 1
              ds.innerHTML = i + '%'
              if (i === 100) {
                clearInterval(timer)
              }
            }, 100)
          }
        }, 80)
      }
    }, 60)
  }
}
</script>

<style scoped>
.http404_con {
  font-family: "微软雅黑";
  background-color: #2068B4;
  height: 100%;
  width: 100%;
  position: absolute;
  min-width: 1080px;
}

.http404_con a {
  color: rgb(1, 176, 255);
}

.http404_con a:hover {
  color: #FFF;
}

.http404 {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  height: 100%;
  margin-left: 15%;
  color: #FFF;
  top: -100px;
}

.http404 ul {
  list-style: none;
}

.p1 {
  font-size: 150px;
  margin-top: 50px;
  margin-bottom: 30px;
}

.p2 {
  font-size: 25px;
  margin-bottom: 5px;
}

.p3 {
  font-size: 25px;
  margin-bottom: 30px;
}

.p4 {
  font-size: 25px;
  margin-bottom: 30px;
}

.p5 {
  display: flex;
  flex-direction: row;
  justify-content: left;
  font-size: 16px;
}
</style>
