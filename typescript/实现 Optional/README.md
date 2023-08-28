type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Partial<Pick<T, K>>>

首先是 去掉所有 要设为可选的键， 然后联合 需要设为可选的键的Partial 结果

# 原文地址
3.07 hbn:/ 实现Optional # 前端开发工程师 # JavaScript # 编程 # 程序员 # web前端 # 前端 # 前端开发  https://v.douyin.com/ieMPux4/ 复制此链接，打开Dou音搜索，直接观看视频！