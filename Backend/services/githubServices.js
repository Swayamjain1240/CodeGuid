export const fetchPRDiff = async (owner, repo, prNumber, token) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.diff',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    const diffText = await response.text();
    return diffText;
  } catch (error) {
    console.error('[GitHub Service fetchPRDiff Error]', error.message);
    throw error;
  }
};

export const postPRComment = async (owner, repo, prNumber, markdownComment, token) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: markdownComment }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post PR comment: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[GitHub Service] Posted security comment to PR #${prNumber} (Comment ID: ${data.id})`);
    return data;
  } catch (error) {
    console.error('[GitHub Service postPRComment Error]', error.message);
    throw error;
  }
};