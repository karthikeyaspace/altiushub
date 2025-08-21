#include <bits/stdc++.h>
using namespace std;


// You are given an array of k linkedlist heads, each list being sorted in ascending order. Write
// a function to merge all the lists into one sorted linked list and return its head.

vector<int> merge2arrays(vector<int> &a, vector<int> &b) {
  int n = a.size();
  int m = b.size();

  int i = 0, j = 0;

  vector<int> ans;

  while(i<n && j<m) {
    if(a[i] < b[j]) {
      ans.push_back(a[i++]);
    }
    else {
      ans.push_back(b[j++]);
    }
  }

  while(i < n) {
    ans.push_back(a[i]);
    i++;
  }

  while(j < m) {
    ans.push_back(b[j]);
    j++;
  }

  return ans;
}

vector<int> mergeK(vector<vector<int>> &lists){
  int n = lists.size();
  
  vector<int> ans = lists[0];

  for(int i = 1; i<n; i++) {
    ans = merge2arrays(ans, lists[i]);
  }

  return ans;
}


int main() {
  vector<vector<int>> lists = {
    {1, 4, 5},
    {1, 3, 4},
    {2, 6}
  };


  vector<int> ans = mergeK(lists);

  for(auto a: ans) {
    cout<< a<< " ";
  }
  cout << endl;
}