#include <bits/stdc++.h>
using namespace std;



vector<int> median(vector<int> &arr, int k) {
  vector<int> ans;

  if(arr.size() < k) {
    return {};
  }

  for(int i = 0; i <= arr.size() - k; i++) {
    vector<int> window(arr.begin() + i, arr.begin() + i + k);
    sort(window.begin(), window.end());
    ans.push_back(window[k/2]);
  }
  
  return ans;
}

int main() {
  vector<int> arr = {1, 3, -1 ,-3, 5, 3, 6, 7};
  int k = 3;


  vector<int> ans = median(arr, k);

  for(auto &a: ans) {
    cout << a << " ";
  }

}