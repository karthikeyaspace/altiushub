#include <bits/stdc++.h>
using namespace std;

// Given a 2D binary matrix of 0's and 1's, find the largest rectangle containing only 1's and return its area.

int maximalRectangle(vector<vector<char>> &matrix) {
	  int m = matrix.size();
	  int n = matrix[0].size();

	  int ans = 0;

    vector<vector<int>> mat(m, vector<int>(n, 0));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            mat[i][j] = matrix[i][j] - '0';
        }
    }

	  for (int i = 0; i < m; i++) {
			for (int j = 0; j < n; j++) {
				  if (i > 0 && j > 0 && mat[i][j] == 1) {
						mat[i][j] = min({mat[i][j - 1], mat[i - 1][j], mat[i - 1][j - 1]}) + 1;
						ans = max(ans, mat[i][j]);
				  }
			}
	  }

	  return ans * ans;
}

int main() {
	  vector<vector<char>> matrix = {
	      {'1', '0', '1', '0', '0'},
	      {'1', '0', '1', '1', '1'},
	      {'1', '1', '1', '1', '1'},
	      {'1', '0', '0', '1', '0'}};

	  cout << maximalRectangle(matrix) << endl;

	  return 0;
}