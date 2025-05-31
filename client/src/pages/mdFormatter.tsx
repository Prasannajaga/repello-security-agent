import MarkDown from 'react-markdown';  
import remarkGfm from 'remark-gfm'

const MarkdownTemplate = ({ content } : {content : string}) => {
  return (
    <div className="prose max-w-none px-4 py-6">
      <MarkDown remarkPlugins={[remarkGfm]}>
        {content}
      </MarkDown>
    </div>
  );
};

export default MarkdownTemplate;
