//这个歌词组件之间的逻辑我没捋清楚。。。后面再看▲▲▲▲

/*我对ES6类的使用场景的理解：像平常的需要调用的公共api可以单独写一个文件来存放，
                           但是如果某一类方法过多则可以单独写一个类文件来进行分类，
                           所以说同一类方法少就都放到公共api文件中，
                           如果同类型方法很多就创建一个类来管理*/

//解析[00:01.997]这一类时间戳的正则表达式   正则表达式回头要复习★★★
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1
export default class Lyric {
  /**
   * @params {string} lrc
   * @params {function} handler
  */
 //在构造器中进行初始化
  constructor(lrc, hanlder = () => { }) {
    this.lrc = lrc;
    this.lines = [];//这是解析后的数组，每一项包含对应的歌词和时间
    this.handler = hanlder;//回调函数
    this.state = STATE_PAUSE;//播放状态
    this.curLineIndex = 0;//当前播放歌词所在的行数
    this.startStamp = 0;//歌曲开始的时间戳

    this._initLines();
  }
  //解析歌词字符串 进行需求性分组、分离
  _initLines() {
    //解析代码
    const lines = this.lrc.split('\n');//根据换行号分离数组
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];//如"[00:01.997]作词: 薛之谦"
      let result = timeExp.exec(line);//对每一行歌词运用正则
      if (!result) continue;//如果result为空，则跳过本次进行下一轮循环
      const txt = line.replace(timeExp, '').trim();//现在把时间戳去掉，只剩下歌词文本
      if (txt) {
        if (result[3].length === 3) {
          result[3] = result[3] / 10;//[00:01.997]中毫秒从三位变两位
        }
        this.lines.push({//此处的lines是构造器中创建的变量不是这个函数中创建的  两个不是同一个
          time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,//转化具体到毫秒的时间，result[3] * 10可理解为 (result / 100) * 1000
          txt
        });
      }
    }
    this.lines.sort((a, b) => {/*sort函数的用法就是这么奇怪。。。
                                 不传参默认按asc排序，
                                 如果传参则必须传入一个有两个形参且有返回值的参数，返回的值是两个形参的差值，
                                 排序顺序按作差后的正负与否决定*/
      return a.time - b.time;
    });//根据时间排序
  }
  /*
    play函数的作用：
    1.设置当前歌词的状态为播放
    2.向播放器返回当前播放的歌词行号和歌词内容
    3.根据是否手动调整过进度重置下一句歌词播放的时间间隔
  */
  //offset为时间进度，isSeek标志位表示用户是否手动调整进度
  play(offset = 0, isSeek = false) {
    if (!this.lines.length) {
      return;
    }
    this.state = STATE_PLAYING;//设置当前的状态为播放
    this.curLineIndex = this._findcurLineIndex(offset);//根据当前的播放进度找到所在的行
    //现在正处于第this.curLineIndex-1行
    //立即定位，方式是调用传来的回调函数，并把当前歌词信息传给它
    this._callHandler(this.curLineIndex - 1);//根据当前的索引号，向播放器的回调函数传递当前播放的’歌词行号‘和’歌词内容‘
    this.startStamp = +new Date() - offset;//根据时间进度判断歌曲开始的具体时间  
                                           //+是类型转换符，将原类型转换为number类型
                                           //+new Date()：number类型的1970年1月1日午夜以来的毫秒数
    if (this.curLineIndex < this.lines.length) {//如果当前歌词还没播放完，根据是否手动调整过进度重置下一句歌词播放的时间间隔
      clearTimeout(this.timer);//停止定时器
      //继续播放
      this._playRest(isSeek);
    }
  }
  togglePlay(offset) {
    if (this.state === STATE_PLAYING) {//如果之前的状态是播放，贼状态切换为暂停，且停止定时器
      this.stop()
    } else {
      //在play中会执行状态的设置，这里就没必要了吧
      // this.state = STATE_PLAYING
      this.play(offset, true)//如果之前的状态是暂停，则状态切换为播放，且开启定时器定时器
    }
  }
  stop() {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }
  seek(offset) {
    this.play(offset, true)
  }
  _findcurLineIndex(time) {//根据当前时间的偏移量计算歌词所在行
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {//在循环中如果找到了大于偏移量的某个时间点则返回这个时间点所在的歌词的行数
        return i
      }
    }
    return this.lines.length - 1//如果最终也没找到，那么久返回最后一句歌词所在的行数
  }
  _callHandler(i) {
    if (i < 0) {
      return
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }
  // isSeek标志位表示用户是否手动调整进度
  //_playRest这个函数的意义其实在于开启定时器，以到了时间间隔就向播放器传递歌词索引号和歌词内容
  _playRest(isSeek = false) {
    let line = this.lines[this.curLineIndex];//获取下一个播放行的歌词信息
    let delay;
    if (isSeek) {//如果手动调整过进度
      //delay：‘调整进度后’的播放时间点与‘当前’实际播放时间点的‘时间差’，
      //其实就是获取下一句歌词的时间点与传入play函数的offset的时间差
      //line.time：下一句歌词的时间点  
      //(+new Date() - this.startStamp)：传入play函数的offset
      delay = line.time - (+new Date() - this.startStamp);
    } else {
      //拿到当前播放行的歌词开始时间，算间隔
      let preTime = this.lines[this.curLineIndex - 1] ? this.lines[this.curLineIndex - 1].time : 0;//如果当前行的歌词存在则抓取他的时间，否则当做是0
      delay = line.time - preTime;//设置时间差=下一行的时间点-当前行的时间点
    }
    this.timer = setTimeout(() => {
      this._callHandler(this.curLineIndex++);//时间到了就向播放器传递下句歌词的内容和索引号，传递完后curLineIndex自增一次
      //这一个if的意义是重置isseek为未手动调整过进度，同时重置timeout的时间为两句歌词的时间间隔，
      //关键点在于该函数是在定时时间到了才会执行，所以不会产生连续的函数执行，只会在定时时间到了执行一次，直到歌词播放完
      if (this.curLineIndex < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest();
      }
    }, delay)
  }
}