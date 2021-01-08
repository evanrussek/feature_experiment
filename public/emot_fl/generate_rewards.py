import numpy as np
rewards_safe={}
x=np.arange(-3,3)
for i in range(160):
	rewards_safe[str(i)]=[np.random.choice(x),np.random.choice(x)]

print('{}={}'.format('rewards_safe',rewards_safe))