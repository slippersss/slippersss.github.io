# 切分数组

**题目来源：**[切分数组](https://leetcode-cn.com/problems/qie-fen-shu-zu/)

**题解：**

​		看完题目，首先想到的是使用动态规划。定义状态$state[i]$表示切分$nums[0:\ i]$的最小数量，那么对于特定元素$nums[i]$，其会跟$nums[0:\ i]$中的某个元素组成一个组。特别的有两个边界，即$nums[i]$和$nums[0]$匹配上，以及$nums[i]$跟自己匹配上，因此可以写出下面的状态转换
$$
state[i]=min\{1\ \&\&\ gcd(nums[i],\ nums[0]),\ state[j]+1\ \&\&\ gcd(nums[i],\ nums[j+1])>1\ |\ 0\le j\le i-1\}
$$
可以粗略看到，想要知道$state[i]$的结果，就需要扫描一遍此前所有结果，就算不考虑$gcd$用的时间也要$O(N^2)$。

​		再仔细想想，扫描全部似乎有些是在做无用功，能跟$nums[i]$匹配的，涉及的只有跟$nums[i]$有一样质因子的数。换句话说，想知道$state[i]$的结果，只需扫描前面跟$nums[i]$有一样质因子的数对应的$state$就好了。根据这个想法，参考$leetcode$的题解，定义出另外一种状态$f[p]$，表示向数组加入质数$p$后进行切分得到的最小数量，此外还要一个$ans$来记住扫描到此的最佳结果。具体地讲，比如现在扫描到$nums[i]$，$ans$是扫描到$nums[i-1]$的最佳结果，且$nums[i]$有质因子$p$，则有$nums[i]$要么单独成组，对应结果$ans+1$，要么和之前的某个$nums[x]$匹配成组，从而结果还是$f[p]$，因此有状态转换
$$
f[p]=min\{ans+1,\ f[p]\}
$$
注意到上面的$ans$是指扫描到$nums[i-1]$时的最佳结果，那最后到$nums[i]$时$ans$怎么算呢？其实就是根据$nums[i]$的质因子$p$对应的$f[p]$来选择最佳的结果，也就是说，扫描时要得到$nums[i]$对应的最佳结果$ans$，要事先更新好$nums[i]$对应的$f[p]$，看后面的代码会明白这一点的。

​		还剩下最后一个问题，怎么快速获取$nums[i]$的所有质因子呢？看过$leetcode$题解后，我明白了所谓素数筛的做法。如果给定的数中最大的数是$M$，则我们取一个数组$minPrime[M]$来记住从$2$到$M$的每个数的最小质因子，这样可以通过式子
$$
new\ x=x\ /\ minPrime[x]
$$
来不断除以最小质因子来获取新的小的$x$。而且填好$minPrime$这个数组非常简单，看代码很容易就懂了。

**代码：**

```c++
class Solution {
public:
	int splitArray(vector<int> &nums) {
		int n = nums.size(), m = 2, ans = 0, minPrime[1000001] = {0}, f[1000001];
		for(int i = 0; i < n; ++i)
			m = max(m, nums[i]);
		for(int i = 2; i <= m; ++i) {
			if(minPrime[i] == 0) {
				minPrime[i] = i;
				for(int j = 2 * i; j <= m; j += i) {
					if(minPrime[j] == 0) {
						minPrime[j] = i;
					}
				}
			}
		}
		for(int i = 0; i <= m; ++i) {
			f[i] = n;
		}
		for(int i = 0; i < n; ++i) {
			++ans;
			for(int x = nums[i]; x > 1; x /= minPrime[x]) {
				f[minPrime[x]] = min(ans, f[minPrime[x]]);
			}
			for(int x = nums[i]; x > 1; x /= minPrime[x]) {
				ans = min(ans, f[minPrime[x]]);
			}
		}
		return ans;
	}
};
```

**复杂度：**

​		记$N$为$nums$大小，$M$为$nums$中的最大数。

​		时间复杂度为$O(N \ log\ M+M)$，其中$O(N\ log\ M)$是根据代码的循环得出的结果，特别是$O(log\ M)$，我自己一开始并不太理解，后来我猜是由于对数字进行质因分解花费的时间，如何理解？比如说一个数$x$最小质因子小到极致只可能是$2$，其余的质因子都会比$2$大，因此是分解时间上界是$O(log\ M)$就不难理解了。而剩余的$O(M)$，则是填写$minPrime$花费的。

​		空间复杂度为$O(M)$，主要花费在$minPrime$和$f$这两个数组上。