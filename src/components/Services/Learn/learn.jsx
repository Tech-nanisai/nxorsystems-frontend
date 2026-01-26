import React from 'react';
import './learn.css';
import { FaGithub, FaTerminal, FaKey } from 'react-icons/fa';

const Learn = () => {
  return (
    <div className="learn-container">
      <h1 className="learn-heading">GitHub Repository Instructions</h1>
      <p className="posted-by">Posted by: <strong>nanisai</strong></p>
      <p className="posted-type">Type: GitHub Repository</p>

      {/* GitHub Commands Section */}
      <div className="section">
        <h2 className="section-heading">
          <FaGithub className="icon" /> Step-by-Step GitHub Instructions
        </h2>
        <div className="map-container">
  <div className="step">
    <div className="step-number">1</div>
    <div className="step-content">
      <strong>git config --global user.name "Your name"</strong><br />
      Set your Git username globally for all repositories on your system.
    </div>
  </div>
  <div className="connector"></div>
  
  <div className="step">
    <div className="step-number">2</div>
    <div className="step-content">
      <strong>git config --global user.email "youremail@gmail.com"</strong><br />
      Set your email address globally for Git commits.
    </div>
  </div>
  <div className="connector"></div>
  
  <div className="step">
    <div className="step-number">3</div>
    <div className="step-content">
      <strong>git init</strong><br />
      Initialize a new Git repository in your project directory.
    </div>
  </div>
  <div className="connector"></div>
  
  <div className="step">
    <div className="step-number">4</div>
    <div className="step-content">
      <strong>git remote add origin https://github.com/url-address</strong><br />
      Link your local repository to a remote repository (replace `url-address`).
    </div>
  </div>
  <div className="connector"></div>
  
  <div className="step">
    <div className="step-number">5</div>
    <div className="step-content">
      <strong>git add -A</strong><br />
      Stage all changes to be committed.
    </div>
  </div>
  <div className="connector"></div>
  
  <div className="step">
    <div className="step-number">6</div>
    <div className="step-content">
      <strong>git commit -m "project name"</strong><br />
      Save changes with a descriptive commit message.
    </div>
  </div>
  <div className="connector"></div>
  
  <div className="step">
    <div className="step-number">7</div>
    <div className="step-content">
      <strong>git branch -M main</strong><br />
      Rename the default branch to "main."
    </div>
  </div>
  <div className="connector"></div>
  
  <div className="step">
    <div className="step-number">8</div>
    <div className="step-content">
      <strong>git push -u origin main</strong><br />
      Push changes to the remote repository's main branch.
    </div>
  </div>
</div>

      </div>

      {/* Token Process Section */}
      <div className="section">
        <h2 className="section-heading">
          <FaKey className="icon" /> How to Generate a GitHub Token
        </h2>
        <ol className="instructions">
          <li className='list-class'>Log in to your GitHub account.</li>
          <li className='list-class'>Go to <strong>Settings</strong>.</li>
          <li className='list-class'>Under <strong>Developer Settings</strong>, click <strong>Personal Access Tokens</strong>.</li>
          <li className='list-class'>Click <strong>Generate new token</strong>.</li>
          <li className='list-class'>Select the permissions for the token, such as "repo" for repository access.</li>
          <li className='list-class'>Click <strong>Generate token</strong>. A secure token will be displayed (copy it).</li>
          <li className='list-class'>Use this token as the password when prompted during Git operations.</li>
        </ol>
        <p className="note">
          <strong>Note:</strong> Keep your token private and store it securely. If it is compromised, revoke and regenerate a new token.
        </p>
      </div>

      {/* Additional Helpful Content */}
      <div className="section">
        <h2 className="section-heading">
          <FaTerminal className="icon" /> Useful Git Commands with Explanations
        </h2>
        <ul className="useful-commands">
          <li className='list-class'><strong>git status</strong>: Shows the status of your working directory (staged, unstaged, or untracked files).</li>
          <li className='list-class'><strong>git log</strong>: Displays the commit history with details of each commit.</li>
          <li className='list-class'><strong>git clone [URL]</strong>: Copies an existing remote repository to your local machine.</li>
          <li className='list-class'><strong>git pull</strong>: Fetches and merges changes from the remote repository into your local branch.</li>
          <li className='list-class'><strong>git reset [commit]</strong>: Resets your repository to a specific commit, removing subsequent changes.</li>
        </ul>
      </div>
    </div>
  );
};

export default Learn;
