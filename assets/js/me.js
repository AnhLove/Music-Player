const $ = document.querySelector.bind(document)
        const $$ = document.querySelectorAll.bind(document)
        
        const PLAYER_STORAGE_KEY = 'ANHLOVE_PLAYER'

        const player = $('.player')
        const cd = $('.cd')
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')
        const playBtn = $('.btn-toggle-play')
        const progress = $('#progress')
        const prevBtn = $('.btn-prev')
        const nextBtn = $('.btn-next')
        const randomBtn = $('.btn-random')
        const repeatBtn = $('.btn-repeat')
        const playlist = $('.playlist')

        const app = {
            currentIndex: 0,
            isPlaying: false,
            isRandom: false,
            isRepeat: false,
            playedSongs: [],
            config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
            songs: [
                {
                  name: "Cảm ơn em",
                  singer: "Thiên Chí",
                  path: "/assets/music/CamOnEm.m4a",
                  image: "/assets/img/CamOnEm.png"
                },
                {
                  name: "Hoa lá thay lòng",
                  singer: "Pinky Vanh",
                  path: "/assets/music/HoaLaThayLong.m4a",
                  image: "/assets/img/HoaLaThayLong.jpg"
                },
                {
                  name: "Cô gái à em đừng khóc",
                  singer: "Pinky Vanh",
                  path: "/assets/music/CoGaiAEmDungKhoc.m4a",
                  image: "/assets/img/CoGaiAEmDungKhoc.jpg"
                },
                {
                  name: "Collide",
                  singer: "Justine Skye ft. Tyga",
                  path: "/assets/music/Collide.m4a",
                  image: "/assets/img/Collide.jpg"
                },
                {
                  name: "Normal no more",
                  singer: "TYSM",
                  path: "/assets/music/NormalNoMore.m4a",
                  image: "/assets/img/NormalNoMore.jpg"
                },
                {
                  name: "Only",
                  singer: "Lee-Hi",
                  path: "/assets/music/OnlyLeehi.m4a",
                  image: "/assets/img/OnlyLeehi.jpg"
                },
                {
                  name: "Bích thượng quan",
                  singer: "Nhất Khỏa Tiểu Thông,Trương Hiểu Phàm",
                  path: "/assets/music/BichThuongQuan.weba",
                  image: "/assets/img/BichThuongQuan.jpg"
                }
              ],
            setConfig:function(key, value) {
                this.config[key] =value;
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
            },
            render: function() {
                const htmls = this.songs.map((song, index) => {
                  return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div
                          class="thumb"
                          style="
                            background-image: url('${song.image}');
                          "
                        ></div>
                        <div class="body">
                          <h3 class="title">${song.name}</h3>
                          <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                          <i class="fas fa-ellipsis-h"></i>
                        </div>
                  </div>
                  `
                })
                playlist.innerHTML = htmls.join('')
            },
            defineProperties: function () {
                Object.defineProperty(this, 'currentSong', {
                    get: function() {
                        return this.songs[this.currentIndex]
                    }
                })
            },
            handleEvents: function() {
                const _this = this
                const cdWidth = cd.offsetWidth

                // Xử lý CD quay / dừng
                const cdThumbAnimate = cdThumb.animate([
                    {
                      transform: 'rotate(360deg)'
                    }
                ], {
                      duration: 10000, // 10s
                      iterations: Infinity
                })
                cdThumbAnimate.pause()

                // Xử lý phóng to / thu nhỏ CD
                document.onscroll = function() {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop
                    const newCdWidth = cdWidth - scrollTop

                    cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                    cd.style.opacity = newCdWidth / cdWidth
                }

                // Xử lý khi click play
                playBtn.onclick = function() {
                  if (_this.isPlaying){
                    audio.pause()
                  }else{
                    audio.play()
                  }
                }

                // Khi song được play
                audio.onplay = function() {
                    _this.isPlaying = true
                    player.classList.add('playing')
                    cdThumbAnimate.play()
                }

                // Khi song được pause
                audio.onpause = function() {
                    _this.isPlaying = false
                    player.classList.remove('playing')
                    cdThumbAnimate.pause()
                }

                // Khi tiến độ bài hát thay đổi
                audio.ontimeupdate = function () {
                  if (audio.duration) {
                      const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                      progress.value = progressPercent
                  }
                }

                // Xử lý khi tua song
                progress.oninput = function(e) {
                    const seekTime = e.target.value/100 * audio.duration
                    audio.currentTime = seekTime
                }

                // Khi next song
                nextBtn.onclick = function() {
                  if(_this.isRandom){
                      _this.playRandomSong()
                  } else {
                      _this.nextSong()
                  }
                  audio.play()
                  _this.render()
                  _this.scrollToActiveSong()
                }

                // Khi prev song
                prevBtn.onclick = function() {
                  if(_this.isRandom){
                      _this.playRandomSong()
                  } else {
                      _this.prevSong()
                  }
                  audio.play()
                  _this.render()
                  _this.scrollToActiveSong()
                }

                // Xử lý bật / tắt random song
                randomBtn.onclick = function(e) {
                    _this.isRandom = !_this.isRandom
                    _this.setConfig('isRandom', _this.isRandom)
                    if (_this.isRandom) {
                      _this.isRepeat = false
                      repeatBtn.classList.remove('active')
                    }
                    randomBtn.classList.toggle('active', _this.isRandom)
                }

                // Xử lý khi lặp lại một song
                repeatBtn.onclick = function(e) {
                    _this.isRepeat = !_this.isRepeat
                    _this.setConfig('isRepeat', _this.isRepeat)
                    if (_this.isRepeat) {
                      _this.isRandom = false
                      randomBtn.classList.remove('active')
                    }
                    repeatBtn.classList.toggle('active', _this.isRepeat)
                }

                // Xử lý next song khi audio ended
                audio.onended = function() {
                    if(_this.isRepeat) {
                        audio.play()
                    } else {
                        nextBtn.click()
                    }
                }

                // Lắng nghe hành vi click vào playlist
                playlist.onclick = function(e) {
                  const songNode = e.target.closest('.song:not(.active)')
                  if (songNode || e.target.closest('.option')){
                        // Xử lý khi click vào song
                        if(songNode){
                            _this.currentIndex = Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            _this.render()
                            audio.play()
                        }

                        // Xử lý khi click vào song option
                        if(e.target.closest('.option')){

                        }
                    }
                }
            },
            scrollToActiveSong: function() {
                setTimeout(() => {
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center', 
                    })
                }, 300)
            },
            loadCurrentSong: function() {
                heading.textContent = this.currentSong.name
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
                audio.src = this.currentSong.path
            },
            loadConfig: function() {
                this.isRandom = this.config.isRandom
                this.isRepeat = this.config.isRepeat
            },
            nextSong: function() {
                this.currentIndex++
                if(this.currentIndex >= this.songs.length) {
                    this.currentIndex = 0
                }
                this.loadCurrentSong()
            },
            prevSong: function() {
                this.currentIndex--
                if(this.currentIndex < 0) {
                    this.currentIndex = this.songs.length - 1
                }
                this.loadCurrentSong()
            },
            playRandomSong: function() {
                let newIndex
                const totalSongs = this.songs.length

                // Reset nếu đã phát hết
                if (this.playedSongs.length >= totalSongs - 1) {
                    this.playedSongs = []
                }

                do {
                    newIndex = Math.floor(Math.random() * totalSongs)
                } while (newIndex === this.currentIndex || this.playedSongs.includes(newIndex))

                this.currentIndex = newIndex
                this.playedSongs.push(newIndex)
                this.loadCurrentSong()
            },
            start: function() {
              // Gán cấu hình từ config vào ứng dụng
              this.loadConfig() 

              // Định nghĩa các thuộc tính cho object
              this.defineProperties()

              // Lắng nghe/ xử lý các sự kiện (DOM events)
              this.handleEvents()

              // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
              this.loadCurrentSong()

              // Render playlist
              this.render()

              // Hiển thị trạng thái ban đầu của button repeat và random
              randomBtn.classList.toggle('active', this.isRandom)
              repeatBtn.classList.toggle('active', this.isRepeat)
            }
        }

        app.start()